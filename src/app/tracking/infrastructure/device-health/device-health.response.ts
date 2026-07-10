export interface DeviceHealthCheckResponse {
  id: string;
  signalStrengthInDbm: number;
  hardwareTemperature: number;
  issueType: string | null;
  timestamp: string;
  detectedAt: string;
  severity: string;
  needsMaintenance: boolean;
  deviceId: string;
}

export interface RecalibrateDeviceRequest {
  action: string;
  note: string;
}

export type DeviceHealthCheckListResponse = DeviceHealthCheckResponse[];
