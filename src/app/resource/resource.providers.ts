import type { Provider } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  BATCH_INVENTORY_READ_REPOSITORY,
  type BatchInventoryReadRepository,
} from './application/ports/batch-inventory.read-repository';
import { HttpBatchInventoryRepository } from './infrastructure/adapters/http-batch-inventory.repository';
import { SimulatedBatchInventoryRepository } from './infrastructure/adapters/simulated-batch-inventory.repository';
import { ResourceApi } from './infrastructure/resource-api';

export function createBatchInventoryReadRepository(resourceApi: ResourceApi): BatchInventoryReadRepository {
  const base = environment.resourceApi.batchInventoryBaseUrl?.trim();
  if (base) {
    return new HttpBatchInventoryRepository(resourceApi, base, environment.resourceApi.batchInventoryHttpPath);
  }
  return new SimulatedBatchInventoryRepository();
}

export const resourceProviders: Provider[] = [
  {
    provide: BATCH_INVENTORY_READ_REPOSITORY,
    useFactory: createBatchInventoryReadRepository,
    deps: [ResourceApi],
  },
];
