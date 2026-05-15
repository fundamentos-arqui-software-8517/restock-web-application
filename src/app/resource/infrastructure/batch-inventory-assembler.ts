import type { BatchInventorySnapshot } from '../domain/model/batch-inventory.snapshot';
import type { InventoryBatchRow } from '../domain/model/inventory-batch-row.model';
import type { BatchInventoryBatchResponse, BatchInventoryRootResponse } from './batch-inventory-response';

function assembleRow(dto: BatchInventoryBatchResponse): InventoryBatchRow {
  return {
    id: dto.id,
    supplyName: dto.supplyName,
    subtitle: dto.subtitle,
    category: dto.category,
    uomLabel: dto.uomLabel,
    expirationDate: dto.expirationDate,
    stock: dto.stock,
    isPerishable: dto.isPerishable,
    perishableBadgeTone: dto.perishableBadgeTone,
    rowHighlight: dto.rowHighlight,
    minStock: dto.minStock,
    maxStock: dto.maxStock,
  };
}

export function assembleBatchInventorySnapshot(root: BatchInventoryRootResponse): BatchInventorySnapshot {
  const p = root.batchInventory;
  return {
    totalActiveBatches: p.totalActiveBatches,
    totalActiveBatchesDeltaPercent: p.totalActiveBatchesDeltaPercent,
    nearExpiry30Days: p.nearExpiry30Days,
    batches: p.batches.map(assembleRow),
  };
}
