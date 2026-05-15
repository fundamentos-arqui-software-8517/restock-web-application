import { map, type Observable } from 'rxjs';
import type { BatchInventoryReadRepository } from '../../application/ports/batch-inventory.read-repository';
import type { BatchInventorySnapshot } from '../../domain/model/batch-inventory.snapshot';
import { assembleBatchInventorySnapshot } from '../batch-inventory-assembler';
import { ResourceApi } from '../resource-api';

function joinApiUrl(baseUrl: string, httpPath: string): string {
  const base = baseUrl.replace(/\/+$/, '');
  const path = httpPath.startsWith('/') ? httpPath : `/${httpPath}`;
  return `${base}${path}`;
}

/**
 * Loads batch inventory from a remote fake API (e.g. Beeceptor).
 */
export class HttpBatchInventoryRepository implements BatchInventoryReadRepository {
  constructor(
    private readonly resourceApi: ResourceApi,
    private readonly apiBaseUrl: string,
    private readonly batchInventoryHttpPath: string,
  ) {}

  load(): Observable<BatchInventorySnapshot> {
    const url = joinApiUrl(this.apiBaseUrl, this.batchInventoryHttpPath);
    return this.resourceApi.getBatchInventoryRoot(url).pipe(map(assembleBatchInventorySnapshot));
  }
}
