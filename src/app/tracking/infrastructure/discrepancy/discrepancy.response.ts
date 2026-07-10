export interface DiscrepancyItemResponse {
  id: string;
  supplyName: string;
  deviceId: string;
  digitalStock: number;
  physicalStock: number;
  deviation: number;
  severity: string;
  detectionTime: string;
  status: string;
}

export interface DiscrepancyDetailResponse {
  id: string;
  level: string;
  physicalStock: {
    value: number;
    unit: string;
    recordedAt: string;
  };
  systemStock: {
    value: number;
    unit: string;
    recordedAt: string;
  };
  deviceId: string;
  supplyName: string;
  category: string;
  unit: string;
}

export type DiscrepancyListResponse = DiscrepancyItemResponse[];
