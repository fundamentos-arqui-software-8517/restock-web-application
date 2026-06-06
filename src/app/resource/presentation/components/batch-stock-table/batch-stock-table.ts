import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import type { BatchRow } from '../../../infrastructure/batch/batch.assembler';

export type StockLevelFilter = 'any' | 'low' | 'ok' | 'high';

export type BatchStockPaginationFooter =
  | {
      mode: 'empty';
      total: number;
    }
  | {
      mode: 'range';
      from: number;
      to: number;
      total: number;
    };

/**
 * Presentational component responsible for rendering the batch stock table.
 *
 * It receives already filtered and paginated rows from the view and emits UI
 * events when filters or pagination controls change.
 */
@Component({
  selector: 'app-batch-stock-table',
  standalone: true,
  imports: [MatIconModule, DatePipe, DecimalPipe, TranslatePipe],
  templateUrl: './batch-stock-table.html',
  styleUrl: './batch-stock-table.css',
})
export class BatchStockTableComponent {
  @Input() rows: BatchRow[] = [];
  @Input() categories: string[] = [];
  @Input() categoryFilter = 'all';
  @Input() stockLevelFilter: StockLevelFilter = 'any';
  @Input() pageIndex = 0;
  @Input() pageCount = 0;
  @Input() pageNumbers: number[] = [];
  @Input() paginationFooter: BatchStockPaginationFooter | null = null;

  @Output() categoryFilterChange = new EventEmitter<string>();
  @Output() stockLevelFilterChange = new EventEmitter<StockLevelFilter>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() viewBatch = new EventEmitter<BatchRow>();
  @Output() editBatch = new EventEmitter<BatchRow>();
  @Output() deleteBatch = new EventEmitter<BatchRow>();

  protected onCategoryChange(value: string): void {
    this.categoryFilterChange.emit(value);
  }

  protected onStockLevelChange(value: string): void {
    this.stockLevelFilterChange.emit(value as StockLevelFilter);
  }

  protected goPage(index: number): void {
    this.pageChange.emit(index);
  }

  protected onDeleteBatch(row: BatchRow): void {
    this.deleteBatch.emit(row);
  }

  protected onEditBatch(row: BatchRow): void {
    this.editBatch.emit(row);
  }

  protected onViewBatch(row: BatchRow): void {
    this.viewBatch.emit(row);
  }

  protected trackById(_: number, row: BatchRow): string {
    return row.id;
  }
}
