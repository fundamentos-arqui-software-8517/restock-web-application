import type { DeviceHealthCheckResponse } from './device-health.response';
import { DeviceHealthCheck } from '../../domain/model/device-health-check.entity';
import { IssueType, SeverityType } from '../../domain/model/enums';

/**
 * Assembles a device health check response into a domain entity.
 *
 * @param dto Device health check received from the API.
 * @returns A DeviceHealthCheck domain aggregate.
 */
export function assembleDeviceHealthCheck(dto: DeviceHealthCheckResponse): DeviceHealthCheck {
  return DeviceHealthCheck.create(
    dto.id,
    dto.signalStrengthInDbm,
    dto.hardwareTemperature,
    toIssueType(dto.issueType),
    dto.timestamp,
    dto.detectedAt,
    toSeverityType(dto.severity),
    dto.needsMaintenance,
    dto.deviceId,
  );
}

function toSeverityType(severity: string): SeverityType {
  switch (severity.toUpperCase()) {
    case 'CRITICAL':
      return SeverityType.CRITICAL;
    case 'HIGH':
      return SeverityType.HIGH;
    case 'MEDIUM':
      return SeverityType.MEDIUM;
    case 'LOW':
      return SeverityType.LOW;
    default:
      return SeverityType.LOW;
  }
}

function toIssueType(issue: string | null): IssueType | null {
  if (!issue) return null;

  switch (issue.toUpperCase()) {
    case 'SENSOR_MALFUNCTION':
      return IssueType.SENSOR_MALFUNCTION;
    case 'CONNECTION_LOST':
      return IssueType.CONNECTION_LOST;
    case 'HARDWARE_FAILURE':
      return IssueType.HARDWARE_FAILURE;
    case 'OVERHEATING':
      return IssueType.OVERHEATING;
    case 'BATTERY_LOW':
      return IssueType.BATTERY_LOW;
    case 'CALIBRATION_ERROR':
      return IssueType.CALIBRATION_ERROR;
    default:
      return null;
  }
}
