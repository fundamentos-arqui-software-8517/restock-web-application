export interface RegisterKitRequest {
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  items: Array<{ productId: string; quantity: number }>;
}
