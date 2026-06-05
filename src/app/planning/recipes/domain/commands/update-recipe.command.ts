/**
 * Maps to UpdateProductResource (all fields optional, null fields ignored by backend).
 */
export interface UpdateRecipeCommand {
  id: string;
  name?: string;
  description?: string;
  sku?: string;
  imageUrl?: string;
  sellingPrice?: number;
}
