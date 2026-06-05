export interface UpdateBatchCommand {
  id: string;
  code: string;
  currentStock: number;
  expirationDate: string | null;
}
