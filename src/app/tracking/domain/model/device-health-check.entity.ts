import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Aggregate representing a device health / microcontroller status reading
 * for an IoT smart scale device, as reported by the cloud's
 * /api/v1/devices-health endpoint.
 */
export class DeviceHealthCheck implements BaseEntity {
  private constructor(
    public readonly id: string,
    public readonly deviceId: string,
    public readonly branchId: string | null,
    public readonly alertType: string | null,
    public readonly metric: string | null,
    public readonly value: string | null,
    public readonly threshold: string | null,
    public readonly message: string | null,
    public readonly cpuUsagePercentage: number | null,
    public readonly memoryFreeBytes: number | null,
    public readonly voltageVolts: number | null,
    public readonly temperatureInCelsius: number | null,
    public readonly timestamp: string,
  ) {
    this.validate();
  }

  /**
   * Creates a new DeviceHealthCheck instance.
   *
   * @param id Unique health reading identifier.
   * @param deviceId Identifier of the IoT device.
   * @param branchId Branch the device belongs to, if known.
   * @param alertType Alert type raised by the device, or null if none.
   * @param metric Name of the metric that triggered the alert, if any.
   * @param value Reading value associated with the alert, if any.
   * @param threshold Configured threshold breached, if any.
   * @param message Human readable message describing the reading.
   * @param cpuUsagePercentage Microcontroller CPU usage percentage.
   * @param memoryFreeBytes Microcontroller free memory in bytes.
   * @param voltageVolts Supply voltage in volts.
   * @param temperatureInCelsius Microcontroller temperature in Celsius.
   * @param timestamp ISO-8601 timestamp of the reading.
   * @returns A new DeviceHealthCheck instance.
   */
  static create(
    id: string,
    deviceId: string,
    branchId: string | null,
    alertType: string | null,
    metric: string | null,
    value: string | null,
    threshold: string | null,
    message: string | null,
    cpuUsagePercentage: number | null,
    memoryFreeBytes: number | null,
    voltageVolts: number | null,
    temperatureInCelsius: number | null,
    timestamp: string,
  ): DeviceHealthCheck {
    return new DeviceHealthCheck(
      id,
      deviceId,
      branchId,
      alertType,
      metric,
      value,
      threshold,
      message,
      cpuUsagePercentage,
      memoryFreeBytes,
      voltageVolts,
      temperatureInCelsius,
      timestamp,
    );
  }

  /**
   * Creates an empty DeviceHealthCheck for initialisation purposes.
   *
   * @returns An empty DeviceHealthCheck instance.
   */
  static empty(): DeviceHealthCheck {
    return new DeviceHealthCheck('', '', null, null, null, null, null, null, null, null, null, null, '');
  }

  /**
   * Whether this reading represents an active alert condition, as reported
   * by the cloud (an alertType is present).
   *
   * @returns True if the device reported an alert type.
   */
  hasAlert(): boolean {
    return this.alertType !== null && this.alertType !== '';
  }

  private validate(): void {
    if (!this.id) {
      throw new Error('DeviceHealthCheck id cannot be empty.');
    }

    if (!this.deviceId) {
      throw new Error('DeviceHealthCheck deviceId cannot be empty.');
    }
  }
}
