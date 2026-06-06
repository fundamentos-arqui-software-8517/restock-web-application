/**
 * Maps to UpdateProductResource (all fields optional, null fields ignored by backend).
 */
export interface UpdateKitCommand {
  id: string;
  name?: string;
  description?: string;
  sku?: string;
  imageUrl?: string;
  sellingPrice?: number;
}
