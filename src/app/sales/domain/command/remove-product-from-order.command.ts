/**
 * Maps to DELETE /sales-orders/{orderId}/items/{itemId}.
 */
export interface RemoveProductFromOrderCommand {
  orderId: string;
  itemId: string;
}
