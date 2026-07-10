import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { TaskStatus } from './enums';

/**
 * Abstract base entity representing a tracking task within the bounded context.
 *
 * All concrete task types (e.g. StockComparisonTask, ConciliationTask) extend
 * this class and inherit lifecycle management via complete(), cancel() and fail().
 */
export abstract class Task implements BaseEntity {
  protected constructor(
    public readonly id: string,
    private _status: TaskStatus,
    public readonly createdAt: string,
    public readonly deviceId: string,
  ) {}

  get status(): TaskStatus {
    return this._status;
  }

  complete(): void {
    this._status = TaskStatus.COMPLETED;
  }

  cancel(): void {
    this._status = TaskStatus.CANCELLED;
  }

  fail(): void {
    this._status = TaskStatus.FAILED;
  }
}
