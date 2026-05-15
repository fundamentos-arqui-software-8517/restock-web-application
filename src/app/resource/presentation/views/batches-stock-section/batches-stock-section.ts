import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import type { InventoryBatchRow } from '../../../domain/model/inventory-batch-row.model';
import { ResourceStore } from '../../../application/resource.store';

type CategoryFilter = string;
type StockLevelFilter = 'any' | 'low' | 'ok' | 'high';

@Component({
  selector: 'app-batches-stock-section',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, DatePipe, DecimalPipe, TranslatePipe],
  templateUrl: './batches-stock-section.html',
  styleUrl: './batches-stock-section.css',
})
export class BatchesStockSection {
  private readonly store = inject(ResourceStore);

  protected readonly snapshot = this.store.snapshot;
  protected readonly loading = this.store.loading;
  protected readonly loadError = this.store.loadError;

  protected readonly categoryFilter = signal<CategoryFilter>('all');
  protected readonly stockLevelFilter = signal<StockLevelFilter>('any');
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = 10;

  constructor() {
    this.store.refreshBatchInventory();

    effect(() => {
      const pages = this.pageCount();
      if (pages === 0) {
        this.pageIndex.set(0);
        return;
      }
      if (this.pageIndex() > pages - 1) {
        this.pageIndex.set(pages - 1);
      }
    });
  }

  protected readonly categories = computed(() => {
    const snap = this.snapshot();
    if (!snap) return [] as string[];
    const set = new Set(snap.batches.map((b) => b.category));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  });

  protected readonly filteredRows = computed(() => {
    const snap = this.snapshot();
    if (!snap) return [] as InventoryBatchRow[];
    const cat = this.categoryFilter();
    const lvl = this.stockLevelFilter();
    return snap.batches.filter((row) => {
      if (cat !== 'all' && row.category !== cat) return false;
      if (lvl === 'any') return true;
      const level = this.stockLevelOf(row);
      return level === lvl;
    });
  });

  protected readonly totalFiltered = computed(() => this.filteredRows().length);

  protected readonly totalBatchesForPager = computed(() => this.snapshot()?.totalActiveBatches ?? 0);

  protected readonly pageCount = computed(() => {
    const total = this.totalFiltered();
    if (total === 0) return 0;
    return Math.ceil(total / this.pageSize);
  });

  protected readonly pagedRows = computed(() => {
    const rows = this.filteredRows();
    const start = this.pageIndex() * this.pageSize;
    return rows.slice(start, start + this.pageSize);
  });

  protected readonly paginationFooter = computed(() => {
    const totalFiltered = this.totalFiltered();
    const platform = this.totalBatchesForPager();
    if (totalFiltered === 0) {
      return { mode: 'empty' as const, total: platform };
    }
    return {
      mode: 'range' as const,
      from: this.pageIndex() * this.pageSize + 1,
      to: Math.min((this.pageIndex() + 1) * this.pageSize, totalFiltered),
      total: platform,
    };
  });

  protected onCategoryChange(value: string): void {
    this.categoryFilter.set(value);
    this.pageIndex.set(0);
  }

  protected onStockLevelChange(value: string): void {
    this.stockLevelFilter.set(value as StockLevelFilter);
    this.pageIndex.set(0);
  }

  protected goPage(i: number): void {
    const totalPages = this.pageCount();
    if (totalPages === 0) return;
    const max = totalPages - 1;
    const next = Math.max(0, Math.min(max, i));
    this.pageIndex.set(next);
  }

  protected pageNumbers(): number[] {
    const total = this.pageCount();
    if (total === 0) return [];
    const current = this.pageIndex();
    const windowSize = Math.min(3, total);
    const start = Math.max(0, Math.min(current - 1, total - windowSize));
    return Array.from({ length: windowSize }, (_, k) => start + k);
  }

  protected stockLevelOf(row: InventoryBatchRow): 'low' | 'ok' | 'high' {
    if (row.stock < row.minStock) return 'low';
    if (row.stock > row.maxStock) return 'high';
    return 'ok';
  }

  protected trackById(_: number, row: InventoryBatchRow): string {
    return row.id;
  }
}
