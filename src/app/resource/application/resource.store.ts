import { inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, of, tap } from 'rxjs';
import type { BatchInventorySnapshot } from '../domain/model/batch-inventory.snapshot';
import type { InventoryBatchRow } from '../domain/model/inventory-batch-row.model';
import { BATCH_INVENTORY_READ_REPOSITORY } from './ports/batch-inventory.read-repository';

/**
 * UI / read-model state for the Resource bounded context (inventory stock screen and related flows).
 */
@Injectable({ providedIn: 'root' })
export class ResourceStore {
  private readonly readRepository = inject(BATCH_INVENTORY_READ_REPOSITORY);

  readonly snapshot = signal<BatchInventorySnapshot | null>(null);
  readonly loadError = signal(false);
  readonly loading = signal(false);
  readonly rows = signal<InventoryBatchRow[]>([]);

  refreshBatchInventory(): void {
    this.loading.set(true);
    this.loadError.set(false);
    this.readRepository
      .load()
      .pipe(
        tap((s) => {
          this.snapshot.set(s);
          this.rows.set(s.batches);
        }),
        catchError(() => {
          this.loadError.set(true);
          return of(null);
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe();
  }
}
