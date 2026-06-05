export interface CreateBatchCommand {
  accountId: string;
  code: string;
  currentStock: number;
  customSupplyId: string;
  branchId: string;
  expirationDate: string | null;
}
