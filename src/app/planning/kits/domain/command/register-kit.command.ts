/**
 * Maps to CreateKitResource (o CreateProductResource en tu back).
 */
export interface RegisterKitCommand {
  accountId: string;
  name: string;
  description?: string;
  sku: string;
  type: 'KIT';
  imageUrl?: string;
  sellingPrice: number;
}
