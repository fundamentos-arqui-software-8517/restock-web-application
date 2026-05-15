/**
 * Tenant catalog item derived from a supply, with stock policy.
 */
export interface CustomSupply {
  id: string;
  businessId: string;
  name: string;
  category: string;
  unitPrice: number;
  minStock: number;
  maxStock: number;
}
