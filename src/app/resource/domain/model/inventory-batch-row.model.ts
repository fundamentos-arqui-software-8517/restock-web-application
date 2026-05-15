export type InventoryBatchRowHighlight = 'warning' | null;

export type PerishableBadgeTone = 'neutral' | 'warning' | 'info';

/**
 * Read model for a physical stock batch shown in the Stock (batches) grid.
 * Denormalized for UI; origin is {@link Batch} plus embedded catalog fields.
 */
export interface InventoryBatchRow {
  id: string;
  supplyName: string;
  subtitle: string | null;
  category: string;
  uomLabel: string;
  expirationDate: string | null;
  stock: number;
  isPerishable: boolean;
  perishableBadgeTone: PerishableBadgeTone;
  rowHighlight: InventoryBatchRowHighlight;
  minStock: number;
  maxStock: number;
}
