import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { SalesOrderEntity } from '../../../domain/model/sales-order.entity';

/**
 * Pure, reusable table that paints a list of sales orders. Doesn't know
 * where the data came from nor what happens on "view detail" — it just
 * emits the id and lets the view (orchestrator) decide.
 */
@Component({
  selector: 'app-transactions-table',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './transactions-table.html',
  styleUrl: './transactions-table.css',
})
export class TransactionsTableComponent {
  @Input() orders: SalesOrderEntity[] = [];
  @Output() viewDetail = new EventEmitter<string>();

  currentPage = 1;
  pageSize = 5;

  get paginatedOrders(): SalesOrderEntity[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.orders.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.orders.length / this.pageSize) || 1;
  }

  get totalOrdersCount(): number {
    return this.orders.length;
  }

  get startIndex(): number {
    if (this.orders.length === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.orders.length);
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPagesArray(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  statusClass(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'status-logged';
      case 'CANCELLED':
        return 'status-failed';
      default:
        return 'status-pending';
    }
  }

  statusLabel(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'sales.table.statusLabel.logged';
      case 'CANCELLED':
        return 'sales.table.statusLabel.failed';
      default:
        return 'sales.table.statusLabel.pending';
    }
  }
}
