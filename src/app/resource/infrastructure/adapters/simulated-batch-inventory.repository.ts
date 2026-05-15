import { map, type Observable, of } from 'rxjs';
import type { BatchInventoryReadRepository } from '../../application/ports/batch-inventory.read-repository';
import type { BatchInventorySnapshot } from '../../domain/model/batch-inventory.snapshot';
import { assembleBatchInventorySnapshot } from '../batch-inventory-assembler';
import { SIMULATED_BATCH_INVENTORY_ROOT } from '../fixtures/batch-inventory.simulated-root';

/**
 * In-memory inventory until `environment.resourceApi.batchInventoryBaseUrl` points to Beeceptor.
 */
export class SimulatedBatchInventoryRepository implements BatchInventoryReadRepository {
  load(): Observable<BatchInventorySnapshot> {
    return of(SIMULATED_BATCH_INVENTORY_ROOT).pipe(map(assembleBatchInventorySnapshot));
  }
}
