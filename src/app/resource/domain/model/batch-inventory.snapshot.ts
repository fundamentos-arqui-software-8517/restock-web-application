import type { InventoryBatchRow } from './inventory-batch-row.model';

/**
 * Dashboard snapshot for the Stock screen (batches list + KPIs).
 */
export interface BatchInventorySnapshot {
  totalActiveBatches: number;
  totalActiveBatchesDeltaPercent: number;
  nearExpiry30Days: number;
  batches: InventoryBatchRow[];
}
