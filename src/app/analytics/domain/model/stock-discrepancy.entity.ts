export interface StockDiscrepancy {
  discrepancyId: string;
  physicalStock: number;
  systemStock: number;
  difference: number;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'RESOLVED' | 'UNRESOLVED';
  isConciliated: boolean;
}

