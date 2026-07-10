/**
 * Structured 422 error payload returned by the backend when there isn't
 * enough physical stock to fulfill a sale (thrown while resolving batch
 * consumption during "complete order"). Powers the "Action Blocked:
 * Insufficient Physical Inventory" modal.
 */
export interface InsufficientStockError {
  customSupplyId: string;
  supplyName: string;
  quantityNeeded: number;
  quantityAvailable: number;
  message: string;
}
