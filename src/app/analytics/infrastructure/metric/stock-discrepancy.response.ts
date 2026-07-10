export interface StockDiscrepancyResponse {
  discrepancyId: string;
  physicalStock: number;
  systemStock: number;
  difference: number;
  riskLevel: string;
  status: string;
  isConciliated: boolean;
}

