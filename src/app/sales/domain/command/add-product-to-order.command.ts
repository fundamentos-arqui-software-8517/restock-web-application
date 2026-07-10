export type SalesProductType = 'KIT' | 'RECIPE' | 'SUPPLY';

/**
 * Maps to AddProductToOrderResource. orderId travels in the URL path.
 */
export interface AddProductToOrderCommand {
  orderId: string;
  productId: string;
  productType: SalesProductType;
  nameSnapshot: string;
  unitPrice: number;
  currency: string;
  quantity: number;
}
