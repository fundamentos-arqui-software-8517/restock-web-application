import { Task } from './task.entity';
import { TaskStatus } from './enums';
import { Discrepancy } from './discrepancy.entity';
import { StockRecord } from './records';

/**
 * Aggregate representing the process of reconciling a detected stock discrepancy.
 *
 * A conciliation task tracks the reason for the discrepancy, the resolution
 * status, and the resulting stock after the reconciliation is applied.
 */
export class ConciliationTask extends Task {
  private constructor(
    id: string,
    status: TaskStatus,
    createdAt: string,
    deviceId: string,
    public readonly reason: string | null,
    public readonly discrepancy: Discrepancy | null,
    public readonly resultingStock: StockRecord | null,
    public readonly resolvedAt: string | null,
  ) {
    super(id, status, createdAt, deviceId);
  }

  /**
   * Creates a new ConciliationTask in PENDING status.
   *
   * @param id Unique task identifier.
   * @param deviceId Identifier of the IoT device.
   * @param discrepancy The discrepancy to be reconciled.
   * @returns A new ConciliationTask instance.
   */
  static create(
    id: string,
    deviceId: string,
    discrepancy: Discrepancy,
  ): ConciliationTask {
    return new ConciliationTask(
      id,
      TaskStatus.PENDING,
      new Date().toISOString(),
      deviceId,
      null,
      discrepancy,
      null,
      null,
    );
  }

  /**
   * Creates an empty ConciliationTask for initialisation purposes.
   *
   * @returns An empty ConciliationTask instance.
   */
  static empty(): ConciliationTask {
    return new ConciliationTask('', TaskStatus.PENDING, '', '', null, null, null, null);
  }

  /**
   * Checks whether the conciliation task is still pending resolution.
   *
   * @returns True if the task is in PENDING status.
   */
  isPending(): boolean {
    return this.status === TaskStatus.PENDING;
  }

  /**
   * Starts the reconciliation process, moving the task to IN_PROGRESS.
   */
  start(): void {
    if (this.status !== TaskStatus.PENDING) {
      throw new Error('Cannot start a conciliation task that is not in PENDING status.');
    }
  }
}
