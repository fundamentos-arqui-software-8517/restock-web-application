export interface RegisterKitRequest {
  accountId: string;
  name: string;
  description: string;
  sku: string;
  type: 'KIT';
  imageUrl: string;
  sellingPrice: number;
}
