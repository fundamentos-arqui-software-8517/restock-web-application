import { Task } from './task.entity';
import { TaskResult, TaskStatus } from './enums';
import { StockRecord } from './records';

/**
 * Aggregate representing a task that compares physical (sensor) stock against
 * digital (system) stock to detect inventory discrepancies.
 *
 * Once the comparison is complete the result is classified as matching,
 * mismatching, or anomalous.
 */
export class StockComparisonTask extends Task {
  private constructor(
    id: string,
    status: TaskStatus,
    createdAt: string,
    deviceId: string,
    public readonly physicalStock: StockRecord,
    public readonly systemStock: StockRecord,
    private _result: TaskResult,
  ) {
    super(id, status, createdAt, deviceId);
    this.validate();
  }

  /**
   * Creates a new StockComparisonTask in PENDING status.
   *
   * @param id Unique task identifier.
   * @param deviceId Identifier of the IoT device performing the comparison.
   * @param physicalStock Stock record from the physical sensor.
   * @param systemStock Stock record from the digital system.
   * @returns A new StockComparisonTask instance.
   */
  static create(
    id: string,
    deviceId: string,
    physicalStock: StockRecord,
    systemStock: StockRecord,
    result: TaskResult = TaskResult.MATCHING,
  ): StockComparisonTask {
    return new StockComparisonTask(
      id,
      TaskStatus.PENDING,
      new Date().toISOString(),
      deviceId,
      physicalStock,
      systemStock,
      result,
    );
  }

  /**
   * Creates an empty StockComparisonTask for initialisation purposes.
   *
   * @returns An empty StockComparisonTask instance.
   */
  static empty(): StockComparisonTask {
    return new StockComparisonTask(
      '',
      TaskStatus.PENDING,
      '',
      '',
      { value: 0, unit: '', recordedAt: '' },
      { value: 0, unit: '', recordedAt: '' },
      TaskResult.MATCHING,
    );
  }

  get result(): TaskResult {
    return this._result;
  }

  /**
   * Marks the result as anomalous, indicating an unexpected reading.
   */
  detectAnomaly(): void {
    this._result = TaskResult.ANOMALY;
  }

  /**
   * Marks the result as matching when physical and system stocks align.
   */
  markAsMatchingStock(): void {
    this._result = TaskResult.MATCHING;
  }

  /**
   * Marks the result as mismatching when physical and system stocks differ.
   */
  markAsMismatchingStock(): void {
    this._result = TaskResult.MISMATCHING;
  }

  private validate(): void {
    if (this.physicalStock.value < 0) {
      throw new Error('StockComparisonTask physical stock value cannot be negative.');
    }

    if (this.systemStock.value < 0) {
      throw new Error('StockComparisonTask system stock value cannot be negative.');
    }
  }
}
