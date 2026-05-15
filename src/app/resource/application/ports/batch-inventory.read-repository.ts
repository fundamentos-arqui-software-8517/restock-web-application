import { InjectionToken } from '@angular/core';
import type { Observable } from 'rxjs';
import type { BatchInventorySnapshot } from '../../domain/model/batch-inventory.snapshot';

export interface BatchInventoryReadRepository {
  load(): Observable<BatchInventorySnapshot>;
}

export const BATCH_INVENTORY_READ_REPOSITORY = new InjectionToken<BatchInventoryReadRepository>(
  'BatchInventoryReadRepository',
);
