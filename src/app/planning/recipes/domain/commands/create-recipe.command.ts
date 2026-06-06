/**
 * Maps to CreateProductResource.
 * type is always "RECIPE" for this module.
 */
export interface CreateRecipeCommand {
  accountId: string;
  name: string;
  description?: string;
  sku: string;
  type: 'RECIPE';
  imageUrl?: string;
  sellingPrice: number;
}
