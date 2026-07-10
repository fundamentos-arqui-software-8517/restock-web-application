/**
 * Read-only value objects describing how a sold item's ingredients were
 * physically fulfilled. Populated by the backend only AFTER a sales order is
 * completed (COMPLETED status) — maps to BatchConsumptionResource /
 * IngredientResolvedResource. They have no identity of their own, so they are
 * kept as plain interfaces instead of full entities.
 */
export interface BatchConsumption {
  batchId: string;
  quantityToConsume: number;
}

export interface IngredientResolved {
  customSupplyId: string;
  name: string;
  quantityRequired: number;
  batchesReserved: BatchConsumption[];
}
