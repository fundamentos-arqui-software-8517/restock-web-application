export interface StockThresholdEvaluateResponse {
  customSupplyId: string;
  customSupplyName: string;
  currentStock: number;
  maxStock: number;
  status: string;
  alertId: string;
}
