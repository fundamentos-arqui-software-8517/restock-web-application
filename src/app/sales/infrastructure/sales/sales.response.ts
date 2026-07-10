/**
 * Raw JSON shapes returned by the Sales bounded context API.
 * Mirror the backend records exactly (SalesOrderResource et al.).
 */
export interface BatchConsumptionResource {
  batchId: string;
  quantityToConsume: number;
}

export interface IngredientResolvedResource {
  customSupplyId: string;
  name: string;
  quantityRequired: number;
  batchesReserved: BatchConsumptionResource[];
}

export interface SalesOrderItemResource {
  id: string;
  productId: string;
  productType: string;
  nameSnapshot: string;
  unitPrice: number;
  quantity: number;
  ingredientsResolved: IngredientResolvedResource[];
}

export interface SalesOrderResource {
  id: string;
  branchId: string;
  status: string;
  items: SalesOrderItemResource[];
  subtotalAmount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  createdAt: string | null;
}

/**
 * Structured body of a 422 response thrown when there isn't enough physical
 * stock to resolve a sale (see GlobalExceptionHandler#handleInsufficientStockException).
 */
export interface InsufficientStockErrorResource {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  customSupplyId: string;
  supplyName: string;
  quantityNeeded: number;
  quantityAvailable: number;
}
