import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { SalesStore } from '../../../application/sales.store';
import { IamStore } from '../../../../iam/application/iam.store';
import { KpiCardComponent } from '../../components/kpi-card/kpi-card';
import { TransactionsTableComponent } from '../../components/transactions-table/transactions-table';
import { TransactionDetailDrawerComponent } from '../../components/transaction-detail-drawer/transaction-detail-drawer';
import { SALES_PATHS } from '../../sales-paths';

/**
 * "Sales Overview" screen: KPIs + transactions table + detail drawer.
 * Orchestrator only — injects the store, wires components, no business logic.
 */
@Component({
  selector: 'app-sales-overview',
  standalone: true,
  imports: [CommonModule, TranslatePipe, KpiCardComponent, TransactionsTableComponent, TransactionDetailDrawerComponent],
  templateUrl: './sales-overview.html',
  styleUrl: './sales-overview.css',
})
export class SalesOverviewComponent implements OnInit {
  protected readonly store = inject(SalesStore);
  private readonly iamStore = inject(IamStore);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  readonly selectedOrderId = signal<string | null>(null);
  readonly selectedOrder = computed(() =>
    this.store.orders().find((o) => o.id === this.selectedOrderId()) ?? null,
  );

  readonly failedSyncRate = computed(() => {
    const finishedOrders = this.store.orders().filter((o) => o.status !== 'PENDING');
    const total = finishedOrders.length;
    if (total === 0) return 0;
    const failed = finishedOrders.filter((o) => o.status === 'CANCELLED').length;
    return (failed / total) * 100;
  });

  readonly salesDeltaCaption = computed(() => {
    const delta = this.store.salesDeltaPercent();
    if (delta === null) return this.translate.instant('sales.overview.kpi.deltaNoData');
    const arrow = delta >= 0 ? '↑' : '↓';
    return this.translate.instant('sales.overview.kpi.deltaPercent', { arrow, percent: Math.abs(delta).toFixed(1) });
  });

  readonly failedSyncCaption = computed(() => {
    const count = this.store.failedOrdersCount();
    if (count === 1) return this.translate.instant('sales.overview.kpi.failedSyncOne');
    return this.translate.instant('sales.overview.kpi.failedSync', { count });
  });

  // Advanced Filters states
  readonly showFilters = signal(false);
  readonly statusFilter = signal('ALL');
  readonly minAmountFilter = signal(0);
  readonly searchTermFilter = signal('');

  readonly filteredOrders = computed(() => {
    // PENDING orders are carts that were opened but never completed or
    // cancelled (e.g. the cashier navigated away mid-sale). They aren't a
    // real sale nor a tracked failure, so they never belong in this table —
    // regardless of the status filter selected.
    let list = this.store.orders().filter((o) => o.status !== 'PENDING');

    const status = this.statusFilter();
    if (status !== 'ALL') {
      list = list.filter((o) => o.status === status);
    }

    const minAmount = this.minAmountFilter();
    if (minAmount > 0) {
      list = list.filter((o) => o.totalAmount >= minAmount);
    }

    const search = this.searchTermFilter().toLowerCase().trim();
    if (search) {
      list = list.filter((o) => o.id.toLowerCase().includes(search));
    }

    return list;
  });

  ngOnInit(): void {
    const accountId = this.iamStore.currentUser()?.accountId;
    if (accountId) {
      this.store.loadOrders(accountId);
    }
  }

  onViewDetail(orderId: string): void {
    this.selectedOrderId.set(orderId);
  }

  onCloseDrawer(): void {
    this.selectedOrderId.set(null);
  }

  goToNewSale(): void {
    this.router.navigateByUrl(SALES_PATHS.newSale.root);
  }

  toggleFilters(): void {
    this.showFilters.update((v) => !v);
  }

  onStatusFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.statusFilter.set(value);
  }

  onMinAmountChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.minAmountFilter.set(value ? parseFloat(value) : 0);
  }

  onSearchTermChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTermFilter.set(value);
  }

  onExportCSV(): void {
    const orders = this.store.orders();
    if (!orders || orders.length === 0) {
      alert(this.translate.instant('sales.overview.noDataAlert'));
      return;
    }

    const headers = [
      this.translate.instant('sales.table.trxId'),
      this.translate.instant('sales.table.timestamp'),
      this.translate.instant('sales.table.itemsCount'),
      this.translate.instant('sales.table.totalValue'),
      this.translate.instant('sales.table.status'),
    ];
    const rows = orders.map((o) => [
      o.id,
      o.createdAt || '',
      o.itemsCount,
      o.totalAmount.toFixed(2),
      o.status,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((r) => r.map((val) => `"${val}"`).join(',')),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `restock_sales_report_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
