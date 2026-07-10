import { ChangeDetectionStrategy, Component, computed, inject, signal, effect } from '@angular/core';
import { NgFor, NgIf, DatePipe, DecimalPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { AnalyticsStore } from '../../../application/analytics.store';
import { IamStore } from '../../../../iam/application/iam.store';
import { MetricCategory, MetricType } from '../../../domain/model/metric.entity';
import { environment } from '../../../../../environments/environment';

interface MetricRow {
  id: string;
  timestamp: string;
  category: MetricCategory;
  typeFormatted: string;
  resourceId: string;
  value: number;
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-dashboard-section',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, DecimalPipe, TranslatePipe],
  templateUrl: './dashboard-section.html',
  styleUrl: './dashboard-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardSectionComponent {
  private readonly store = inject(AnalyticsStore);
  private readonly iamStore = inject(IamStore);

  readonly isLoading = this.store.isLoading;
  readonly selectedRange = this.store.selectedRange;
  readonly metrics = this.store.metrics;

  readonly stockDiscrepancies = this.store.stockDiscrepancies;
  readonly stockDiscrepanciesLoading = this.store.stockDiscrepanciesLoading;

  readonly criticalProducts = this.store.criticalProducts;
  readonly criticalProductsLoading = this.store.criticalProductsLoading;

  constructor() {
    this.store.loadMetrics(this.selectedRange());

    const supplyId = environment.analyticsDefaultStockDiscrepanciesSupplyId;
    if (supplyId) {
      this.store.loadStockDiscrepancies(supplyId);
    }

    const accountId = this.iamStore.currentUser()?.accountId;
    if (accountId) {
      this.store.loadCriticalProducts(accountId);
    }

    effect(() => {
      const currentUser = this.iamStore.currentUser();
      if (currentUser?.accountId) {
        this.store.loadCriticalProducts(currentUser.accountId);
      }
    });
  }

  readonly categoryFilter = signal<MetricCategory | 'All'>('All');
  readonly currentPage = signal<number>(1);
  readonly pageSize = 10;

  readonly inventoryStats = computed(() => {
    const allMetrics = this.metrics();
    const createdSum = this.privateGetSum(allMetrics, 'SUPPLIES_CREATED');
    const lowStockCount = this.privateGetCount(allMetrics, 'LOW_STOCK_SUPPLIES');
    const zeroStockCount = this.privateGetCount(allMetrics, 'ZERO_STOCK_SUPPLIES');
    return { createdSum, lowStockCount, zeroStockCount };
  });

  readonly workersStats = computed(() => {
    const allMetrics = this.metrics();
    const hired = this.privateGetSum(allMetrics, 'WORKERS_HIRED');
    const fired = this.privateGetSum(allMetrics, 'WORKERS_FIRED');
    return { net: hired - fired, hired, fired };
  });

  readonly notificationsStats = computed(() => {
    const allMetrics = this.metrics();
    const sum = this.privateGetSum(allMetrics, 'NOTIFICATIONS_RECEIVED');
    const timestamps = allMetrics.map((m) => new Date(m.lastRefreshedAt).getTime());
    const latest = timestamps.length > 0 ? new Date(Math.max(...timestamps)).toISOString() : null;
    return { sum, lastRefreshedAt: latest };
  });

  readonly salesStats = computed(() => {
    const allMetrics = this.metrics();
    const salesMade = this.privateGetSum(allMetrics, 'SALES_MADE');
    const recipesProfit = this.privateGetSum(allMetrics, 'RECIPES_PROFIT');
    const kitsProfit = this.privateGetSum(allMetrics, 'KITS_PROFIT');
    return { salesMade, recipesProfit, kitsProfit };
  });

  private readonly allRows = computed<MetricRow[]>(() => {
    const rows: MetricRow[] = [];
    for (const metric of this.metrics()) {
      for (const val of metric.values) {
        rows.push({
          id: `${metric.id}-${val.resourceId}`,
          timestamp: metric.lastRefreshedAt,
          category: metric.category,
          typeFormatted: this.privateFormatMetricType(metric.type),
          resourceId: val.resourceId,
          value: val.value,
          startDate: metric.dateRange.startDate,
          endDate: metric.dateRange.endDate,
        });
      }
    }
    return rows.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  });

  readonly filteredRows = computed(() => {
    const filter = this.categoryFilter();
    const rows = this.allRows();
    if (filter === 'All') return rows;
    return rows.filter((r) => r.category === filter);
  });

  readonly totalItems = computed(() => this.filteredRows().length);
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.totalItems() / this.pageSize)));

  readonly paginatedRows = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredRows().slice(start, start + this.pageSize);
  });

  readonly fromItem = computed(() => {
    if (this.totalItems() === 0) return 0;
    return (this.currentPage() - 1) * this.pageSize + 1;
  });

  readonly toItem = computed(() => {
    return Math.min(this.currentPage() * this.pageSize, this.totalItems());
  });

  readonly canPrev = computed(() => this.currentPage() > 1);
  readonly canNext = computed(() => this.currentPage() < this.totalPages());

  readonly highRiskDiscrepancies = computed(() =>
    this.stockDiscrepancies().filter(d => d.riskLevel === 'HIGH')
  );

  readonly totalStockDeficit = computed(() =>
    this.criticalProducts().reduce((sum, p) => sum + p.stockDeficit, 0)
  );

  onRangeChange(range: '7d' | '30d' | '90d'): void {
    this.store.loadMetrics(range);
    this.currentPage.set(1);
  }

  onCategoryChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.categoryFilter.set(target.value as MetricCategory | 'All');
    this.currentPage.set(1);
  }

  onNextPage(): void {
    if (this.canNext()) {
      this.currentPage.update((p) => p + 1);
    }
  }

  onPrevPage(): void {
    if (this.canPrev()) {
      this.currentPage.update((p) => p - 1);
    }
  }

  exportPdf(): void {
    console.log('Exporting PDF...');
  }

  viewAllUnits(): void {
    console.log('View all units');
  }
  private privateGetSum(allMetrics: ReturnType<typeof this.metrics>, type: MetricType): number {
    return allMetrics
      .filter((m) => m.type === type)
      .flatMap((m) => m.values)
      .reduce((acc, curr) => acc + curr.value, 0);
  }

  private privateGetCount(allMetrics: ReturnType<typeof this.metrics>, type: MetricType): number {
    return allMetrics
      .filter((m) => m.type === type)
      .flatMap((m) => m.values).length;
  }

  private privateFormatMetricType(type: MetricType): string {
    return type
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  categoryBadgeClass(category: MetricCategory | 'All'): string {
  const map: Record<MetricCategory, string> = {
    INVENTORY:     'badge-teal',
    WORKERS:       'badge-blue',
    NOTIFICATIONS: 'badge-amber',
    SALES:         'badge-green',
  };
  return map[category as MetricCategory] ?? '';
}
}
