import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { assembleBatch, BatchData } from './batch/batch.assembler';
import { BATCH_ENDPOINT } from './batch/batch.endpoint';
import type { CustomSupply } from '../domain/model/custom-supply.entity';

import type {
  BatchItemResponse,
  BatchRootResponse,
  CreateBatchRequest,
  TransferBatchRequest,
  UpdateBatchRequest,
} from './batch/batch.response';

export interface BranchResource {
  id: string;
  name: string;
  status?: string;
}

type BranchDto = Partial<{
  id: string | { value?: string; id?: string };
  branchId: string | { value?: string; id?: string };
  name: string | { value?: string };
  branchName: string | { value?: string };
  status: string;
}>;

type BranchRootResponse =
  | BranchDto[]
  | {
      data?: BranchDto[] | { content?: BranchDto[]; branches?: BranchDto[]; items?: BranchDto[] };
      branches?: BranchDto[];
      content?: BranchDto[];
      items?: BranchDto[];
      branch?: { data?: BranchDto[]; branches?: BranchDto[] };
    };

/**
 * HTTP entry point for the Resource bounded context.
 *
 * This API service centralizes access to resource-related data such as
 * batches, supplies and custom supplies.
 */
@Injectable({ providedIn: 'root' })
export class ResourceApi {
  private readonly http = inject(HttpClient);
  private readonly primaryBaseUrl = environment.platformProviderApiBaseUrl;
  private readonly fallbackBaseUrl = 'http://localhost:8080/api/v1';
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

  private get branchesUrl(): string {
    return `${this.currentBaseUrl}/branches`;
  }

  /**
   * Loads batch data from the backend.
   * 
   * @param accountId Optional account filter.
   * @param customSupplies Supplies used to enrich table rows.
   * @returns An observable with assembled batch data.
   */
  getBatch(accountId?: string, customSupplies: CustomSupply[] = []): Observable<BatchData> {
    const operation = () => {
      const options = accountId ? { params: new HttpParams().set('accountId', accountId) } : undefined;

      return this.http
        .get<BatchRootResponse | BatchItemResponse[]>(this.batchesUrl, options)
        .pipe(map((response) => assembleBatch(response, customSupplies)));
    };

    return operation().pipe(catchError(() => this.withFallback(operation)));
  }

  /**
   * Creates a batch.
   */
  createBatch(accountId: string, body: CreateBatchRequest): Observable<BatchItemResponse> {
    const params = new HttpParams().set('accountId', accountId);
    const operation = () => this.http.post<BatchItemResponse>(this.batchesUrl, body, { params });

    return operation().pipe(catchError(() => this.withFallback(operation)));
  }

  /**
   * Updates a batch.
   */
  updateBatch(batchId: string, body: UpdateBatchRequest): Observable<BatchItemResponse> {
    const operation = () => this.http.patch<BatchItemResponse>(
      `${this.batchesUrl}/${encodeURIComponent(batchId)}`,
      body,
    );

    return operation().pipe(catchError(() => this.withFallback(operation)));
  }

  /**
   * Deletes a batch.
   */
  deleteBatch(batchId: string): Observable<void> {
    const operation = () => this.http.delete<void>(`${this.batchesUrl}/${encodeURIComponent(batchId)}`);

    return operation().pipe(catchError(() => this.withFallback(operation)));
  }

  /**
   * Transfers stock from one batch to another branch.
   */
  transferBatch(batchId: string, body: TransferBatchRequest): Observable<BatchItemResponse> {
    const operation = () => this.http.post<BatchItemResponse>(
      `${this.batchesUrl}/${encodeURIComponent(batchId)}/transfer`,
      body,
    );

    return operation().pipe(catchError(() => this.withFallback(operation)));
  }

  getBranches(accountId = ''): Observable<BranchResource[]> {
    const options = accountId ? { params: new HttpParams().set('accountId', accountId) } : undefined;
    const operation = () =>
      this.http
        .get<BranchRootResponse>(this.branchesUrl, options)
        .pipe(map((response) => this.assembleBranches(response)));

    return operation().pipe(catchError(() => this.withFallback(operation)));
  }

  private assembleBranches(response: BranchRootResponse): BranchResource[] {
    const branches = this.branchItemsFrom(response);

    return branches
      .map((branch): BranchResource | null => {
        const id = this.stringValue(branch.id) || this.stringValue(branch.branchId);
        const name = this.stringValue(branch.name) || this.stringValue(branch.branchName);

        if (!id || !name) return null;

        return branch.status ? { id, name, status: branch.status } : { id, name };
      })
      .filter((branch): branch is BranchResource => branch !== null);
  }

  private branchItemsFrom(response: BranchRootResponse): BranchDto[] {
    if (Array.isArray(response)) return response;

    if (Array.isArray(response.data)) return response.data;

    return (
      response.branches ??
      response.content ??
      response.items ??
      response.branch?.data ??
      response.branch?.branches ??
      response.data?.content ??
      response.data?.branches ??
      response.data?.items ??
      []
    );
  }

  private stringValue(value: string | { value?: string; id?: string } | undefined): string {
    if (!value) return '';
    if (typeof value === 'string') return value;

    return value.value ?? value.id ?? '';
  }
}
