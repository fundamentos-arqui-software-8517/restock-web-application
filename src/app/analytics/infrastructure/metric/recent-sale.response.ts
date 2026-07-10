export interface RecentSaleResponse {
  saleId: string;
  branchId: string | null;
  branchName: string | null;
  totalAmount: number | null;
  saleDate: string;
  status: string | null;
}

