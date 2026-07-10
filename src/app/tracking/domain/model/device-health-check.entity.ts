import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { SeverityType, IssueType } from './enums';

/**
 * Aggregate representing a health check performed on an IoT smart scale device.
 *
 * Captures hardware diagnostics such as signal strength, temperature, and
 * detected issues to determine whether the device requires maintenance.
 */
export class DeviceHealthCheck implements BaseEntity {
  private constructor(
    public readonly id: string,
    public readonly signalStrengthInDbm: number,
    public readonly hardwareTemperature: number,
    public readonly issueType: IssueType | null,
    public readonly timestamp: string,
    public readonly detectedAt: string,
    public readonly severity: SeverityType,
    public readonly needsMaintenance: boolean,
    public readonly deviceId: string,
  ) {
    this.validate();
  }

  /**
   * Creates a new DeviceHealthCheck instance.
   *
   * @param id Unique health check identifier.
   * @param signalStrengthInDbm Signal strength in dBm.
   * @param hardwareTemperature Hardware temperature in Celsius.
   * @param issueType Detected issue type, or null if healthy.
   * @param timestamp ISO-8601 timestamp of the health check.
   * @param detectedAt ISO-8601 timestamp when the issue was detected.
   * @param severity Severity level of the detected issue.
   * @param needsMaintenance Whether the device requires maintenance.
   * @param deviceId Identifier of the IoT device.
   * @returns A new DeviceHealthCheck instance.
   */
  static create(
    id: string,
    signalStrengthInDbm: number,
    hardwareTemperature: number,
    issueType: IssueType | null,
    timestamp: string,
    detectedAt: string,
    severity: SeverityType,
    needsMaintenance: boolean,
    deviceId: string,
  ): DeviceHealthCheck {
    return new DeviceHealthCheck(
      id,
      signalStrengthInDbm,
      hardwareTemperature,
      issueType,
      timestamp,
      detectedAt,
      severity,
      needsMaintenance,
      deviceId,
    );
  }

  /**
   * Creates an empty DeviceHealthCheck for initialisation purposes.
   *
   * @returns An empty DeviceHealthCheck instance.
   */
  static empty(): DeviceHealthCheck {
    return new DeviceHealthCheck('', 0, 0, null, '', '', SeverityType.LOW, false, '');
  }

  /**
   * Evaluates the overall health of the device based on signal strength,
   * hardware temperature, and the presence of critical issues.
   *
   * @returns 'healthy' if no issues, 'warning' if borderline, 'critical' if urgent.
   */
  evaluateHealth(): 'healthy' | 'warning' | 'critical' {
    if (this.severity === SeverityType.CRITICAL) {
      return 'critical';
    }

    if (this.issueType !== null) {
      return 'warning';
    }

    if (this.signalStrengthInDbm < -90) {
      return 'warning';
    }

    if (this.hardwareTemperature > 75) {
      return 'warning';
    }

    return 'healthy';
  }

  /**
   * Determines whether the detected issue is critical based on severity.
   *
   * @returns True if the issue severity is CRITICAL.
   */
  isCriticalIssue(): boolean {
    return this.severity === SeverityType.CRITICAL;
  }

  private validate(): void {
    if (!this.id) {
      throw new Error('DeviceHealthCheck id cannot be empty.');
    }

    if (this.hardwareTemperature < -40 || this.hardwareTemperature > 125) {
      throw new Error('DeviceHealthCheck hardwareTemperature must be between -40 and 125 Celsius.');
    }
  }
}
