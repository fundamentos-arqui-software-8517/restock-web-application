import { signal, computed, Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Metric } from '../domain/model/metric.entity';
import { StockDiscrepancy } from '../domain/model/stock-discrepancy.entity';
import { RecentSale } from '../domain/model/recent-sale.entity';
import { CriticalProduct } from '../domain/model/critical-product.entity';
import { AnalyticsApi } from '../infrastructure/analytics-api';
import { userErrorMessage } from '../../shared/infrastructure/user-error-message';

@Injectable({ providedIn: 'root' })
export class AnalyticsStore {
  private readonly analyticsApi = inject(AnalyticsApi);
  private readonly translate = inject(TranslateService);
  readonly metrics = signal<Metric[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly selectedRange = signal<'7d' | '30d' | '90d'>('7d');

  readonly stockDiscrepancies = signal<StockDiscrepancy[]>([]);
  readonly stockDiscrepanciesLoading = signal<boolean>(false);
  readonly stockDiscrepanciesError = signal<string | null>(null);

  readonly recentSales = signal<RecentSale[]>([]);
  readonly recentSalesLoading = signal<boolean>(false);
  readonly recentSalesError = signal<string | null>(null);

  readonly criticalProducts = signal<CriticalProduct[]>([]);
  readonly criticalProductsLoading = signal<boolean>(false);
  readonly criticalProductsError = signal<string | null>(null);

  readonly dateRange = signal<{ startDate?: string; endDate?: string }>({});

  readonly hasDiscrepancies = computed(() => this.stockDiscrepancies().length > 0);
  readonly hasCriticalProducts = computed(() => this.criticalProducts().length > 0);
  readonly totalCriticalProductsDeficit = computed(() =>
    this.criticalProducts().reduce((sum, p) => sum + p.stockDeficit, 0)
  );

  loadMetrics(range: '7d' | '30d' | '90d'): void {
    this.selectedRange.set(range);
    this.isLoading.set(true);
    setTimeout(() => this.isLoading.set(false), 500);
  }

  loadStockDiscrepancies(productId: string): void {
    this.stockDiscrepanciesLoading.set(true);
    this.stockDiscrepanciesError.set(null);

    this.analyticsApi.getStockDiscrepancies(productId).subscribe({
      next: (data) => {
        this.stockDiscrepancies.set(data);
        this.stockDiscrepanciesLoading.set(false);
      },
      error: (error) => {
        this.stockDiscrepanciesError.set(this.friendlyError(error, 'shared.errors.loadStockDiscrepancies'));
        this.stockDiscrepanciesLoading.set(false);
      },
    });
  }

  loadRecentSales(
    accountId: string,
    startDate?: string,
    endDate?: string
  ): void {
    this.recentSalesLoading.set(true);
    this.recentSalesError.set(null);

    this.analyticsApi.getRecentSales(accountId, startDate, endDate).subscribe({
      next: (data) => {
        this.recentSales.set(data);
        this.recentSalesLoading.set(false);
        if (startDate && endDate) {
          this.dateRange.set({ startDate, endDate });
        }
      },
      error: (error) => {
        this.recentSalesError.set(this.friendlyError(error, 'shared.errors.loadRecentSales'));
        this.recentSalesLoading.set(false);
      },
    });
  }

  loadCriticalProducts(accountId: string): void {
    this.criticalProductsLoading.set(true);
    this.criticalProductsError.set(null);

    this.analyticsApi.getSupplies().subscribe({
      next: (supplies) => {
        const supplyMap = new Map(supplies.map(s => [s.id, s.description]));

        this.analyticsApi.getCriticalProducts(accountId).subscribe({
          next: (data) => {
            this.criticalProducts.set(
              data.map(p => ({
                ...p,
                description: supplyMap.get(p.supplyId) ?? '',
              }))
            );
            this.criticalProductsLoading.set(false);
          },
          error: (error) => {
            this.criticalProductsError.set(this.friendlyError(error, 'shared.errors.loadCriticalProducts'));
            this.criticalProductsLoading.set(false);
          },
        });
      },
      error: () => {
        this.analyticsApi.getCriticalProducts(accountId).subscribe({
          next: (data) => {
            this.criticalProducts.set(data);
            this.criticalProductsLoading.set(false);
          },
          error: (error) => {
            this.criticalProductsError.set(this.friendlyError(error, 'shared.errors.loadCriticalProducts'));
            this.criticalProductsLoading.set(false);
          },
        });
      },
    });
  }

  private friendlyError(error: unknown, fallbackKey: string): string {
    return userErrorMessage(
      error,
      this.translate.instant(fallbackKey),
      (key, params) => this.translate.instant(key, params),
    );
  }
}
