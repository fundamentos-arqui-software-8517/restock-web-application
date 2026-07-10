import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { assembleBatch, BatchData } from './batch/batch.assembler';
import { BATCH_ENDPOINT } from './batch/batch.endpoint';
import { assembleBranch, assembleBranchList } from './branch/branch.assembler';
import {
  BRANCHES_BY_ACCOUNT_URL,
  BRANCH_BY_ID_URL,
  BRANCH_STATUS_URL,
  BRANCHES_URL,
} from './branch/branch.endpoint';
import type {
  BranchListResponse,
  BranchResponse,
  CreateBranchRequest,
  DeleteBranchResponse,
  UpdateBranchRequest,
  UpdateBranchStatusRequest,
} from './branch/branch.response';
import type { CustomSupply } from '../domain/model/custom-supply.entity';
import type { Branch } from '../domain/model/branch.entity';
import type {
  BatchItemResponse,
  BatchRootResponse,
  CreateBatchRequest,
  TransferBatchRequest,
  UpdateBatchRequest,
} from './batch/batch.response';

/**
 * HTTP façade for the Resource bounded context.
 *
 * Each aggregate (Batch, Branch) has its own request/response types,
 * assembler and endpoint module. This service only wires HTTP calls
 * to those modules — no assembly logic lives here.
 */
@Injectable({ providedIn: 'root' })
export class ResourceApi {
  private readonly http = inject(HttpClient);
  private readonly primaryBaseUrl = environment.baseUrl;
  private readonly fallbackBaseUrl = environment.baseUrl;
  private currentBaseUrl = this.primaryBaseUrl;

  private withFallback<T>(operation: () => Observable<T>): Observable<T> {
    const previous = this.currentBaseUrl;
    this.currentBaseUrl = this.fallbackBaseUrl;
    const result$ = operation();
    this.currentBaseUrl = previous;
    return result$;
  }

  private get batchesUrl(): string {
    return `${this.currentBaseUrl}/${BATCH_ENDPOINT}`;
  }

  // ── Batch ────────────────────────────────────────────────────────────────

  getBatch(accountId?: string, customSupplies: CustomSupply[] = []): Observable<BatchData> {
    const operation = () => {
      const options = accountId
        ? { params: new HttpParams().set('accountId', accountId) }
        : undefined;
      return this.http
        .get<BatchRootResponse | BatchItemResponse[]>(this.batchesUrl, options)
        .pipe(map((response) => assembleBatch(response, customSupplies)));
    };
    return operation().pipe(catchError(() => this.withFallback(operation)));
  }

  createBatch(accountId: string, body: CreateBatchRequest): Observable<BatchItemResponse> {
    const params = new HttpParams().set('accountId', accountId);
    const operation = () =>
      this.http.post<BatchItemResponse>(this.batchesUrl, body, { params });
    return operation().pipe(catchError(() => this.withFallback(operation)));
  }

  updateBatch(batchId: string, body: UpdateBatchRequest): Observable<BatchItemResponse> {
    const operation = () =>
      this.http.patch<BatchItemResponse>(
        `${this.batchesUrl}/${encodeURIComponent(batchId)}`,
        body,
      );
    return operation().pipe(catchError(() => this.withFallback(operation)));
  }

  deleteBatch(batchId: string): Observable<void> {
    const operation = () =>
      this.http.delete<void>(`${this.batchesUrl}/${encodeURIComponent(batchId)}`);
    return operation().pipe(catchError(() => this.withFallback(operation)));
  }

  transferBatch(batchId: string, body: TransferBatchRequest): Observable<BatchItemResponse> {
    const operation = () =>
      this.http.post<BatchItemResponse>(
        `${this.batchesUrl}/${encodeURIComponent(batchId)}/transfer`,
        body,
      );
    return operation().pipe(catchError(() => this.withFallback(operation)));
  }

  // ── Branch ───────────────────────────────────────────────────────────────

  getBranches(accountId?: string): Observable<Branch[]> {
    const url = accountId ? BRANCHES_BY_ACCOUNT_URL(accountId) : BRANCHES_URL;
    const operation = () =>
      this.http
        .get<BranchListResponse>(url)
        .pipe(map((response) => assembleBranchList(response)));
    return operation().pipe(catchError(() => this.withFallback(operation)));
  }

  getBranchById(branchId: string): Observable<Branch> {
    const operation = () =>
      this.http
        .get<BranchResponse>(BRANCH_BY_ID_URL(branchId))
        .pipe(map((response) => assembleBranch(response)));
    return operation().pipe(catchError(() => this.withFallback(operation)));
  }

  createBranch(accountId: string, body: CreateBranchRequest): Observable<Branch> {
    const formData = branchFormData(body);
    const operation = () =>
      this.http
        .post<BranchResponse>(BRANCHES_BY_ACCOUNT_URL(accountId), formData)
        .pipe(map((response) => assembleBranch(response)));
    return operation().pipe(catchError(() => this.withFallback(operation)));
  }

  updateBranch(branchId: string, body: UpdateBranchRequest): Observable<Branch> {
    const formData = branchFormData(body);
    const operation = () =>
      this.http
        .patch<BranchResponse>(BRANCH_BY_ID_URL(branchId), formData)
        .pipe(map((response) => assembleBranch(response)));
    return operation().pipe(catchError(() => this.withFallback(operation)));
  }

  updateBranchStatus(branchId: string, body: UpdateBranchStatusRequest): Observable<Branch> {
    const operation = () =>
      this.http
        .patch<BranchResponse>(BRANCH_STATUS_URL(branchId), body)
        .pipe(map((response) => assembleBranch(response)));
    return operation().pipe(catchError(() => this.withFallback(operation)));
  }

  deleteBranch(branchId: string): Observable<DeleteBranchResponse> {
    const operation = () =>
      this.http.delete<DeleteBranchResponse>(BRANCH_BY_ID_URL(branchId));
    return operation().pipe(catchError(() => this.withFallback(operation)));
  }
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function branchFormData(
  body: CreateBranchRequest | UpdateBranchRequest,
): FormData {
  const fd = new FormData();
  if (body.name)          fd.append('name', body.name);
  if (body.address)       fd.append('address', body.address);
  if (body.city)          fd.append('city', body.city);
  if (body.country)       fd.append('country', body.country);
  if (body.regionOrState) fd.append('regionOrState', body.regionOrState);
  if (body.description)   fd.append('description', body.description);
  if (body.image)         fd.append('image', body.image);
  return fd;
}
