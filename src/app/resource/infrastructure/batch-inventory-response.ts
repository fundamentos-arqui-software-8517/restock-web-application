export interface BatchInventoryBatchResponse {
  id: string;
  supplyName: string;
  subtitle: string | null;
  category: string;
  uomLabel: string;
  expirationDate: string | null;
  stock: number;
  isPerishable: boolean;
  perishableBadgeTone: 'neutral' | 'warning' | 'info';
  rowHighlight: 'warning' | null;
  minStock: number;
  maxStock: number;
}

export interface BatchInventoryPayloadResponse {
  totalActiveBatches: number;
  totalActiveBatchesDeltaPercent: number;
  nearExpiry30Days: number;
  batches: BatchInventoryBatchResponse[];
}

export interface BatchInventoryRootResponse {
  batchInventory: BatchInventoryPayloadResponse;
}
