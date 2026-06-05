export interface TransferBatchCommand {
  batchId: string;
  targetBranchId: string;
  quantity: number;
  unitMeasurement: string;
  reason: string;
}
