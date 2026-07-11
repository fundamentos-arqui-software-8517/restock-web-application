import type { DeviceHealthCheckResponse } from './device-health.response';
import { DeviceHealthCheck } from '../../domain/model/device-health-check.entity';

/**
 * Assembles a device health response into a domain entity.
 *
 * @param dto Device health reading received from the API.
 * @returns A DeviceHealthCheck domain aggregate.
 */
export function assembleDeviceHealthCheck(dto: DeviceHealthCheckResponse): DeviceHealthCheck {
  return DeviceHealthCheck.create(
    dto.id,
    dto.deviceId,
    dto.branchId,
    dto.alertType,
    dto.metric,
    dto.value,
    dto.threshold,
    dto.message,
    dto.cpuUsagePercentage,
    dto.memoryFreeBytes,
    dto.voltageVolts,
    dto.temperatureInCelsius,
    dto.timestamp,
  );
}
