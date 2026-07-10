export interface TelemetryReadingResponse {
  id: string;
  timestamp: string;
  physicalStock: number;
  temperature: number;
  humidity: number;
  deviceId: string;
}

export type TelemetryReadingListResponse = TelemetryReadingResponse[];
