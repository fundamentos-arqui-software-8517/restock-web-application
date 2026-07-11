export interface DeviceHealthCheckResponse {
  id: string;
  deviceId: string;
  branchId: string | null;
  alertType: string | null;
  metric: string | null;
  value: string | null;
  threshold: string | null;
  message: string | null;
  cpuUsagePercentage: number | null;
  memoryFreeBytes: number | null;
  voltageVolts: number | null;
  temperatureInCelsius: number | null;
  timestamp: string;
}

export type DeviceHealthCheckListResponse = DeviceHealthCheckResponse[];
