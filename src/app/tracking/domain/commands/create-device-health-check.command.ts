export interface CreateDeviceHealthCheckCommand {
  deviceId: string;
  branchId: string | null;
  alertType: string | null;
  metric: string | null;
  value: string | null;
  threshold: string | null;
  message: string | null;
}
