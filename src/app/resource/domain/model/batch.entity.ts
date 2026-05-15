/**
 * Aggregate root for physical inventory (per schema): stock tied to a custom supply and branch.
 */
export interface Batch {
  id: string;
  customSupplyId: string;
  branchId: string;
  currentQuantity: number;
  expirationDate: string | null;
}
