export interface KitResponse {
  id: string;
  name: string;
  sku?: string;
  price: number;
  description: string;
  imageUrl: string;
  status: string;
  items: Array<{
    id: string;
    name: string;
    sku: string;
    price: number;
    quantity: number;
  }>;
}
