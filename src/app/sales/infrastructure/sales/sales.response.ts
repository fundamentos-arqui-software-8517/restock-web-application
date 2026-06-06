import { BaseResource, BaseResponse } from '../../../shared/infrastructure/base-response';

/**
 * SaleResource
 * Represents a single sale record.
 */
export interface SaleResource extends BaseResource {
  branchId: string;
  businessId: string;
  registeredByUserId: string;
  customer: CustomerResource | string;
  currency: CurrencyResource | string;
  saleItems: SaleItemResource[];
  saleTotal: SaleTotalResource;
  saleStatus: string;
  date: string;
}

/**
 * CustomerResource
 * Represents a customer in a sale.
 */
export interface CustomerResource {
  name: string;
}

/**
 * CurrencyResource
 * Represents a currency in a sale.
 */
export interface CurrencyResource {
  code: string;
  symbol: string;
}

/**
 * SaleItemResource
 * Represents an item in a sale.
 */
export interface SaleItemResource {
  itemId: string;
  nameSnapshot: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  imageUrl?: string;
}

/**
 * SaleTotalResource
 * Represents the total amount of a sale.
 */
export interface SaleTotalResource {
  subTotal: number;
  tax: number;
  total: number;
}

/**
 * SaleResponse
 * Represents the response returned by the get sale endpoint.
 */
export interface SalesResponse extends BaseResponse, SaleResource {
  sales: SaleResource[];
}
