import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents a telemetry reading captured from an IoT smart scale device.
 *
 * Contains environmental and stock data recorded at a specific moment in time.
 */
export class TelemetryReading implements BaseEntity {
  private constructor(
    public readonly id: string,
    public readonly timestamp: string,
    public readonly physicalStock: number,
    public readonly temperature: number,
    public readonly humidity: number,
    public readonly deviceId: string,
  ) {
    this.validate();
  }

  /**
   * Creates a new TelemetryReading instance.
   *
   * @param id Unique reading identifier.
   * @param timestamp ISO-8601 timestamp of the reading.
   * @param physicalStock Stock weight/value recorded by the scale.
   * @param temperature Ambient temperature at the device location.
   * @param humidity Ambient humidity percentage at the device location.
   * @param deviceId Identifier of the IoT device.
   * @returns A new TelemetryReading instance.
   */
  static create(
    id: string,
    timestamp: string,
    physicalStock: number,
    temperature: number,
    humidity: number,
    deviceId: string,
  ): TelemetryReading {
    return new TelemetryReading(id, timestamp, physicalStock, temperature, humidity, deviceId);
  }

  /**
   * Creates an empty TelemetryReading instance for initialisation purposes.
   *
   * @returns An empty TelemetryReading instance.
   */
  static empty(): TelemetryReading {
    return new TelemetryReading('', '', 0, 0, 0, '');
  }

  private validate(): void {
    if (this.physicalStock < 0) {
      throw new Error('TelemetryReading physicalStock cannot be negative.');
    }

    if (this.humidity < 0 || this.humidity > 100) {
      throw new Error('TelemetryReading humidity must be between 0 and 100.');
    }
  }
}
