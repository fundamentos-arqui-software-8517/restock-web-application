import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { ResourceStore } from '../../../application/resource.store';
import { IamStore as AuthService } from '../../../../iam/application/iam.store';
import type { BatchRow } from '../../../infrastructure/batch/batch.assembler';
import {
  BatchStockTableComponent,
  type StockLevelFilter,
} from '../../components/batch-stock-table/batch-stock-table';

type CategoryFilter = string;

/**
 * Resource view responsible for displaying the batch stock section.
 *
 * This view owns screen state, filters and pagination logic, while delegating
 * the table rendering to a presentation component.
 */
@Component({
  selector: 'app-batches-stock-section',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, DatePipe, DecimalPipe, TranslatePipe, FormsModule, BatchStockTableComponent],
  templateUrl: './batches-stock-section.html',
  styleUrl: './batches-stock-section.css',
})
export class BatchesStockSection {
  private readonly store = inject(ResourceStore);
  private readonly authService = inject(AuthService);

  protected readonly loading = this.store.loading;
  protected readonly loadError = this.store.loadError;

  protected readonly totalActiveBatches = this.store.totalActiveBatches;
  protected readonly totalActiveBatchesDeltaPercent = this.store.totalActiveBatchesDeltaPercent;
  protected readonly nearExpiry30Days = this.store.nearExpiry30Days;
  protected readonly rows = this.store.rows;
  protected readonly customSupplies = this.store.customSupplies;
  protected readonly branches = this.store.branches;
  protected readonly currentBranchId = this.store.currentBranchId;

  protected readonly categoryFilter = signal<CategoryFilter>('all');
  protected readonly stockLevelFilter = signal<StockLevelFilter>('any');
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = 10;
  protected readonly showAddBatchModal = signal(false);
  protected readonly showEditBatchModal = signal(false);
  protected readonly showBatchDetailModal = signal(false);
  protected readonly batchPendingDelete = signal<BatchRow | null>(null);
  protected readonly showTransferBatchPanel = signal(false);
  protected readonly selectedBatch = signal<BatchRow | null>(null);
  protected readonly batchFormWarning = signal('');

  protected readonly batchForm = {
    code: '',
    customSupplyId: '',
    branchId: '',
    currentStock: 0,
    expirationDate: '',
  };

  protected readonly transferForm = {
    batchId: '',
    targetBranchId: '',
    quantity: 0,
    unitMeasurement: '',
    reason: '',
  };

  constructor() {
    const accountId = this.authService.currentUser()?.accountId;
    if (accountId) {
      this.store.setAccountId(accountId);
    }
    this.store.refreshBatch();

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
    const set = new Set(this.rows().map((row) => row.category));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  });

  protected readonly filteredRows = computed(() => {
    const category = this.categoryFilter();
    const stockLevel = this.stockLevelFilter();

    return this.rows().filter((row) => {
      if (category !== 'all' && row.category !== category) return false;
      if (stockLevel === 'any') return true;

      return this.stockLevelOf(row) === stockLevel;
    });
  });

  protected readonly totalFiltered = computed(() => this.filteredRows().length);

  protected readonly pageCount = computed(() => {
    const total = this.totalFiltered();

    if (total === 0) return 0;

    return Math.ceil(total / this.pageSize);
  });

  protected readonly pagedRows = computed(() => {
    const start = this.pageIndex() * this.pageSize;
    return this.filteredRows().slice(start, start + this.pageSize);
  });

  protected readonly pageNumbers = computed(() => {
    const total = this.pageCount();

    if (total === 0) return [];

    const current = this.pageIndex();
    const windowSize = Math.min(3, total);
    const start = Math.max(0, Math.min(current - 1, total - windowSize));

    return Array.from({ length: windowSize }, (_, index) => start + index);
  });

  protected readonly paginationFooter = computed(() => {
    const totalFiltered = this.totalFiltered();
    const totalPlatformBatches = this.totalActiveBatches();

    if (totalFiltered === 0) {
      return {
        mode: 'empty' as const,
        total: totalPlatformBatches,
      };
    }

    return {
      mode: 'range' as const,
      from: this.pageIndex() * this.pageSize + 1,
      to: Math.min((this.pageIndex() + 1) * this.pageSize, totalFiltered),
      total: totalPlatformBatches,
    };
  });

  protected onCategoryChange(value: string): void {
    this.categoryFilter.set(value);
    this.pageIndex.set(0);
  }

  protected onStockLevelChange(value: StockLevelFilter): void {
    this.stockLevelFilter.set(value);
    this.pageIndex.set(0);
  }

  protected goPage(index: number): void {
    const totalPages = this.pageCount();

    if (totalPages === 0) return;

    const max = totalPages - 1;
    const next = Math.max(0, Math.min(max, index));

    this.pageIndex.set(next);
  }

  protected onDeleteBatch(batchId: string): void {
    this.store.deleteBatch(batchId);
  }

  protected askDeleteBatch(row: BatchRow): void {
    this.batchPendingDelete.set(row);
  }

  protected confirmDeleteBatch(): void {
    const batch = this.batchPendingDelete();
    if (!batch) return;

    this.store.deleteBatch(batch.id);
    this.batchPendingDelete.set(null);
    this.showBatchDetailModal.set(false);
  }

  protected cancelDeleteBatch(): void {
    this.batchPendingDelete.set(null);
  }

  protected openAddBatchModal(): void {
    this.batchFormWarning.set('');
    this.batchForm.code = '';
    this.batchForm.customSupplyId = '';
    this.batchForm.branchId = this.currentOriginBranch()?.id ?? '';
    this.batchForm.currentStock = 0;
    this.batchForm.expirationDate = '';
    this.showAddBatchModal.set(true);
  }

  protected openEditBatchModal(row: BatchRow): void {
    this.batchFormWarning.set('');
    this.selectedBatch.set(row);
    this.batchForm.code = row.code;
    this.batchForm.customSupplyId = row.customSupplyId;
    this.batchForm.branchId = row.branchId;
    this.batchForm.currentStock = row.stock;
    this.batchForm.expirationDate = row.expirationDate ?? '';
    this.showBatchDetailModal.set(false);
    this.showEditBatchModal.set(true);
  }

  protected openBatchDetailModal(row: BatchRow): void {
    this.selectedBatch.set(row);
    this.showBatchDetailModal.set(true);
  }

  protected openTransferPanel(): void {
    const firstBatch = this.rows()[0];
    this.transferForm.batchId = firstBatch?.id ?? '';
    this.transferForm.targetBranchId = '';
    this.transferForm.quantity = 0;
    this.transferForm.unitMeasurement = firstBatch?.uomLabel ?? '';
    this.transferForm.reason = '';
    this.showTransferBatchPanel.set(true);
  }

  protected closeBatchDialogs(): void {
    this.showAddBatchModal.set(false);
    this.showEditBatchModal.set(false);
    this.showBatchDetailModal.set(false);
    this.showTransferBatchPanel.set(false);
    this.selectedBatch.set(null);
  }

  protected onBatchSupplyChange(customSupplyId: string): void {
    this.batchFormWarning.set('');
    this.batchForm.customSupplyId = customSupplyId;

    if (!this.selectedCustomSupplyRequiresExpiration()) {
      this.batchForm.expirationDate = '';
    }
  }

  protected createBatch(): void {
    const form = this.batchForm;
    this.batchFormWarning.set('');
    if (!form.code || !form.customSupplyId || !form.branchId || form.currentStock <= 0) return;
    if (!this.validateBatchStockRange(Number(form.currentStock))) return;

    const requiresExpiration = this.selectedCustomSupplyRequiresExpiration();
    if (requiresExpiration && !form.expirationDate) return;

    this.store.createBatch({
      accountId: this.store.accountId(),
      code: form.code,
      currentStock: Number(form.currentStock),
      customSupplyId: form.customSupplyId,
      branchId: form.branchId,
      expirationDate: requiresExpiration ? form.expirationDate : '',
    });
    this.closeBatchDialogs();
  }

  protected updateBatch(): void {
    const selected = this.selectedBatch();
    const form = this.batchForm;
    this.batchFormWarning.set('');
    if (!selected || !form.code || form.currentStock < 0) return;

    const requiresExpiration = this.selectedCustomSupplyRequiresExpiration();
    if (requiresExpiration && !form.expirationDate) return;

    this.store.updateBatch({
      id: selected.id,
      code: form.code,
      currentStock: Number(form.currentStock),
      expirationDate: requiresExpiration ? form.expirationDate : null,
    });
    this.closeBatchDialogs();
  }

  protected transferBatch(): void {
    const form = this.transferForm;
    const batch = this.rows().find((row) => row.id === form.batchId);
    if (!batch || !form.targetBranchId || form.quantity <= 0) return;

    this.store.transferBatch({
      batchId: form.batchId,
      targetBranchId: form.targetBranchId,
      quantity: Number(form.quantity),
      unitMeasurement: form.unitMeasurement || batch.uomLabel,
      reason: form.reason,
    });
    this.closeBatchDialogs();
  }

  private stockLevelOf(row: BatchRow): 'low' | 'ok' | 'high' {
    if (row.stock < row.minStock) return 'low';
    if (row.stock > row.maxStock) return 'high';

    return 'ok';
  }

  protected selectedCustomSupplyRequiresExpiration(): boolean {
    const selectedBatch = this.selectedBatch();

    if (selectedBatch) return selectedBatch.isPerishable;

    return this.customSupplies()
      .find((supply) => supply.id === this.batchForm.customSupplyId)
      ?.isPerishable() ?? false;
  }

  protected currentOriginBranch() {
    const branchId = this.currentBranchId();

    return this.branches().find((branch) => branch.id === branchId) ?? this.branches()[0] ?? null;
  }

  protected branchName(branchId: string): string {
    return this.branches().find((branch) => branch.id === branchId)?.name ?? branchId;
  }

  protected currentOriginBranchName(): string {
    return this.currentOriginBranch()?.name ?? 'Current branch unavailable';
  }

  protected selectedCustomSupplyUnit(): string {
    return this.customSupplies()
      .find((supply) => supply.id === this.batchForm.customSupplyId)
      ?.unit.abbreviation || 'UNITS';
  }

  protected batchDetailUnitLabel(batch: BatchRow): string {
    const supply = this.customSupplies().find((item) => item.id === batch.customSupplyId);
    if (!supply) return batch.uomLabel;

    const name = supply.unit.name || batch.uomLabel;
    const abbreviation = supply.unit.abbreviation || batch.uomLabel;

    return name === abbreviation ? abbreviation : `${name} (${abbreviation})`;
  }

  private validateBatchStockRange(stock: number): boolean {
    const supply = this.customSupplies().find((item) => item.id === this.batchForm.customSupplyId);
    if (!supply) return true;

    if (stock < supply.minStock || stock > supply.maxStock) {
      this.batchFormWarning.set(
        `Initial stock must be between ${supply.minStock} and ${supply.maxStock} for ${supply.name}.`,
      );
      return false;
    }

    return true;
  }
}
