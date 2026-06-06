/**
 * Maps to AddIngredientResource.
 * totalCost is calculated server-side from the supply's current unit price.
 */
export interface AddKitItemCommand {
  productId: string;
  customSupplyId: string;
  quantity: number;
}
