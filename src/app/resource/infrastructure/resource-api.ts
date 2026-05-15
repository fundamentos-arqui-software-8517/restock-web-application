import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { type Observable } from 'rxjs';
import type { BatchInventoryRootResponse } from './batch-inventory-response';

/**
 * HTTP entry point for the Resource bounded context (inventory, supplies, …).
 */
@Injectable({ providedIn: 'root' })
export class ResourceApi {
  private readonly http = inject(HttpClient);

  getBatchInventoryRoot(url: string): Observable<BatchInventoryRootResponse> {
    return this.http.get<BatchInventoryRootResponse>(url);
  }
}
