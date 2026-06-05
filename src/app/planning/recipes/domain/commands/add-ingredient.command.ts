/**
 * Maps to AddIngredientResource.
 * totalCost is calculated server-side from the supply's current unit price.
 */
export interface AddIngredientCommand {
  productId: string;
  customSupplyId: string;
  quantity: number;
}
