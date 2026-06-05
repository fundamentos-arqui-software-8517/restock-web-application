/**
 * Request payload structure for registering or updating a Kit via API.
 */
export interface KitsRequest {
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}
