import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { DiscrepancyLevel } from './enums';
import { StockRecord } from './records';

/**
 * Represents a detected discrepancy between physical and system stock records.
 *
 * Discrepancies are created when a StockComparisonTask reveals a mismatch
 * between what the system expects and what the smart scale measures.
 */
export class Discrepancy implements BaseEntity {
  private constructor(
    public readonly id: string,
    private _level: DiscrepancyLevel,
    public readonly physicalStock: StockRecord,
    public readonly systemStock: StockRecord,
    public readonly deviceId: string,
  ) {
    this.validate();
  }

  /**
   * Creates a new Discrepancy instance.
   *
   * @param id Unique discrepancy identifier.
   * @param level Severity level of the discrepancy.
   * @param physicalStock Stock record from the smart scale sensor.
   * @param systemStock Stock record from the digital system.
   * @param deviceId Identifier of the IoT device that reported the discrepancy.
   * @returns A new Discrepancy instance.
   */
  static create(
    id: string,
    level: DiscrepancyLevel,
    physicalStock: StockRecord,
    systemStock: StockRecord,
    deviceId: string,
  ): Discrepancy {
    return new Discrepancy(id, level, physicalStock, systemStock, deviceId);
  }

  /**
   * Creates an empty Discrepancy instance for initialisation purposes.
   *
   * @returns An empty Discrepancy instance.
   */
  static empty(): Discrepancy {
    return new Discrepancy(
      '',
      DiscrepancyLevel.LOW,
      { value: 0, unit: '', recordedAt: '' },
      { value: 0, unit: '', recordedAt: '' },
      '',
    );
  }

  get level(): DiscrepancyLevel {
    return this._level;
  }

  /**
   * Calculates the absolute difference between physical and system stock values.
   *
   * @returns The absolute difference between physical and system stock.
   */
  calculateDiscrepancyDifference(): number {
    return Math.abs(this.physicalStock.value - this.systemStock.value);
  }

  private validate(): void {
    if (!this.id) {
      throw new Error('Discrepancy id cannot be empty.');
    }

    if (!this.deviceId) {
      throw new Error('Discrepancy deviceId cannot be empty.');
    }
  }
}
