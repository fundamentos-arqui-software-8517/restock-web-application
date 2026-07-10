import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  Observable,
  catchError,
  EMPTY,
  finalize,
  forkJoin,
  map,
  of,
  throwError,
  tap,
} from 'rxjs';

import { ResourceApi } from '../infrastructure/resource-api';
import type { BatchData, BatchRow } from '../infrastructure/batch/batch.assembler';
import type { CreateBatchCommand } from '../domain/commands/create-batch.command';
import type { TransferBatchCommand } from '../domain/commands/transfer-batch.command';
import type { UpdateBatchCommand } from '../domain/commands/update-batch.command';
import type { CreateBranchCommand } from '../domain/commands/create-branch.command';
import type { UpdateBranchCommand } from '../domain/commands/update-branch.command';
import type { UpdateBranchStatusCommand } from '../domain/commands/update-branch-status.command';
import type { BatchItemResponse } from '../infrastructure/batch/batch.response';
import { Branch } from '../domain/model/branch.entity';
import { CustomSupply } from '../domain/model/custom-supply.entity';
import { Supply } from '../domain/model/supply.entity';
import { assembleCustomSupply } from '../infrastructure/custom-supply/custom-supply.assembler';
import {
  CREATE_CUSTOM_SUPPLY_URL,
  CUSTOM_SUPPLIES_BY_ACCOUNT_URL,
  DELETE_CUSTOM_SUPPLY_URL,
  UPDATE_CUSTOM_SUPPLY_URL,
} from '../infrastructure/custom-supply/custom-supply.endpoint';
import type {
  AccountCustomSuppliesResponse,
  CustomSupplyListResponse,
  CustomSupplyResponse,
} from '../infrastructure/custom-supply/custom-supply.response';
import { assembleSupply } from '../infrastructure/supply/supply.assembler';
import { SUPPLY_CATEGORIES_URL, SUPPLY_ENDPOINT } from '../infrastructure/supply/supply.endpoint';
import type { SupplyResponse } from '../infrastructure/supply/supply.response';
import { IamStore as AuthService } from '../../iam/application/iam.store';
import { ProfilesStore } from '../../profiles/application/profiles.store';

@Injectable({ providedIn: 'root' })
export class ResourceStore {
  readonly loading = signal(false);
  readonly loadError = signal(false);

  readonly totalActiveBatches = signal(0);
  readonly totalActiveBatchesDeltaPercent = signal(0);
  readonly nearExpiry30Days = signal(0);
  readonly rows = signal<BatchRow[]>([]);

  readonly customSupplies = signal<CustomSupply[]>([]);
  readonly supplyTemplates = signal<Supply[]>([]);
  readonly supplyCategories = signal<string[]>([]);
  readonly branches = signal<Branch[]>([]);
  readonly currentBranchId = signal('');
  readonly accountId = signal('');

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly resourceApi = inject(ResourceApi);
  private readonly authService = inject(AuthService);
  private readonly profilesStore = inject(ProfilesStore);

  // ── Batch ─────────────────────────────────────────────────────────────────

  refreshBatch(): void {
    this.loading.set(true);
    this.loadError.set(false);

    forkJoin({
      customSupplies: this.fetchCustomSuppliesByAccount(this.accountId()).pipe(
        catchError((error: any) => {
          this.handleAuthError(error);
          return of([]);
        }),
      ),
      branches: this.resourceApi.getBranches(this.accountId()).pipe(
        catchError(() => of([] as Branch[])),
      ),
    }).subscribe(({ customSupplies, branches }) => {
      this.customSupplies.set(customSupplies);
      this.applyBranches(branches);
      const branchId = this.currentBranchId();

      this.resourceApi
        .getBatch(this.accountId(), customSupplies)
        .pipe(
          tap((batch: BatchData) => {
            const branchRows = this.rowsForBranch(batch.batches, branchId);
            this.totalActiveBatches.set(branchRows.length);
            this.totalActiveBatchesDeltaPercent.set(batch.totalActiveBatchesDeltaPercent);
            this.nearExpiry30Days.set(branchRows.filter((row) => this.isNearExpiry(row)).length);
            this.rows.set(branchRows);
          }),
          catchError(() => {
            this.loadError.set(true);
            this.rows.set([]);
            return EMPTY;
          }),
          finalize(() => this.loading.set(false)),
        )
        .subscribe();
    });
  }

  setAccountId(accountId: string): void {
    if (accountId) this.accountId.set(accountId);
  }

  loadInventoryContext(accountId = this.accountId()): void {
    this.setAccountId(accountId);
    this.loadCustomSuppliesByAccount(accountId);
    this.loadBranches(accountId);
    this.refreshBatch();
  }

  createBatch(command: CreateBatchCommand): Observable<BatchItemResponse> {
    return this.resourceApi
      .createBatch(command.accountId, {
        code: command.code,
        currentStock: command.currentStock,
        customSupplyId: command.customSupplyId,
        branchId: command.branchId,
        expirationDate: command.expirationDate ?? '',
      })
      .pipe(
        tap(() => this.refreshBatch()),
        catchError((error) => {
          this.loadError.set(true);
          return throwError(() => error);
        }),
      );
  }

  updateBatch(command: UpdateBatchCommand): Observable<BatchItemResponse> {
    return this.resourceApi
      .updateBatch(command.id, {
        code: command.code,
        currentStock: command.currentStock,
        expirationDate: command.expirationDate,
      })
      .pipe(
        tap(() => this.refreshBatch()),
        catchError((error) => {
          this.loadError.set(true);
          return throwError(() => error);
        }),
      );
  }

  transferBatch(command: TransferBatchCommand): void {
    this.resourceApi
      .transferBatch(command.batchId, {
        targetBranchId: command.targetBranchId,
        quantity: command.quantity,
        unitMeasurement: command.unitMeasurement,
        reason: command.reason,
      })
      .pipe(
        tap(() => this.refreshBatch()),
        catchError(() => {
          this.loadError.set(true);
          return EMPTY;
        }),
      )
      .subscribe();
  }

  deleteBatch(batchId: string): void {
    this.resourceApi
      .deleteBatch(batchId)
      .pipe(
        tap(() => {
          this.rows.update((rows) => rows.filter((row) => row.id !== batchId));
          this.totalActiveBatches.update((total) => Math.max(0, total - 1));
        }),
        catchError(() => {
          this.loadError.set(true);
          return EMPTY;
        }),
      )
      .subscribe();
  }

  // ── Branch ────────────────────────────────────────────────────────────────

  loadBranches(
    accountId = this.accountId() || this.authService.currentUser()?.accountId || '',
  ): void {
    this.resourceApi
      .getBranches(accountId)
      .pipe(
        tap((branches) => this.applyBranches(branches)),
        catchError(() => of([] as Branch[])),
      )
      .subscribe();
  }

  createBranch(command: CreateBranchCommand): Observable<Branch> {
    const accountId =
      command.accountId ||
      this.accountId() ||
      this.authService.currentUser()?.accountId ||
      '';

    return this.resourceApi
      .createBranch(accountId, {
        name: command.name,
        address: command.address,
        city: command.city,
        country: command.country,
        regionOrState: command.regionOrState,
        description: command.description,
        image: command.image,
      })
      .pipe(
        tap((branch) => {
          this.branches.update((list) => [...list, branch]);
        }),
      );
  }

  updateBranch(command: UpdateBranchCommand): Observable<Branch> {
    return this.resourceApi
      .updateBranch(command.branchId, {
        name: command.name,
        address: command.address,
        city: command.city,
        country: command.country,
        regionOrState: command.regionOrState,
        description: command.description,
        image: command.image,
      })
      .pipe(
        tap((updated) => {
          this.branches.update((list) =>
            list.map((b) => (b.id === updated.id ? updated : b)),
          );
        }),
      );
  }

  updateBranchStatus(command: UpdateBranchStatusCommand): Observable<Branch> {
    return this.resourceApi
      .updateBranchStatus(command.branchId, { status: command.status })
      .pipe(
        tap((updated) => {
          this.branches.update((list) =>
            list.map((b) => (b.id === updated.id ? updated : b)),
          );
        }),
      );
  }

  deleteBranch(branchId: string): Observable<void> {
    return this.resourceApi.deleteBranch(branchId).pipe(
      tap(() => {
        this.branches.update((list) => list.filter((b) => b.id !== branchId));
        if (this.currentBranchId() === branchId) {
          this.currentBranchId.set(this.branches()[0]?.id ?? '');
        }
      }),
      map(() => undefined),
    );
  }

  setCurrentBranchId(branchId: string): void {
    if (branchId) {
      this.currentBranchId.set(branchId);
      this.profilesStore.setCurrentBranchId(branchId);
    }
  }

  // ── Custom Supply ─────────────────────────────────────────────────────────

  loadSupplyTemplates(): void {
    this.http
      .get<SupplyResponse[]>(SUPPLY_ENDPOINT)
      .pipe(
        tap((responses) => this.supplyTemplates.set(responses.map(assembleSupply))),
        catchError((error) => {
          console.error('[ResourceStore] loadSupplyTemplates error', error);
          return EMPTY;
        }),
      )
      .subscribe();
  }

  loadSupplyCategories(): void {
    this.http
      .get<string[]>(SUPPLY_CATEGORIES_URL)
      .pipe(
        tap((categories) => this.supplyCategories.set(categories)),
        catchError((error) => {
          console.error('[ResourceStore] loadSupplyCategories error', error);
          return EMPTY;
        }),
      )
      .subscribe();
  }

  getSupplyTemplates(): Supply[] {
    return this.supplyTemplates();
  }

  loadCustomSuppliesByAccount(accountId: string): void {
    if (!accountId) {
      console.warn('[ResourceStore] loadCustomSuppliesByAccount called with empty accountId');
      return;
    }

    this.loading.set(true);
    this.fetchCustomSuppliesByAccount(accountId)
      .pipe(
        tap((supplies) => this.customSupplies.set(supplies)),
        catchError((error: any) => {
          console.error('[ResourceStore] loadCustomSuppliesByAccount error', error);
          this.handleAuthError(error);
          this.loadError.set(true);
          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe();
  }

  getCustomSupplies(): CustomSupply[] {
    return this.customSupplies();
  }

  getCustomSupplyById(id: string): CustomSupply | undefined {
    return this.customSupplies().find((supply) => supply.id === id);
  }

  createCustomSupply(formData: FormData, accountId: string): Observable<CustomSupply> {
    return this.http
      .post<CustomSupplyResponse>(CREATE_CUSTOM_SUPPLY_URL(accountId), formData)
      .pipe(
        map((response) => assembleCustomSupply(response)),
        tap(() => this.loadCustomSuppliesByAccount(accountId)),
      );
  }

  updateCustomSupply(
    customSupplyId: string,
    formData: FormData,
    accountId: string,
  ): Observable<CustomSupply> {
    return this.http
      .patch<CustomSupplyResponse>(
        UPDATE_CUSTOM_SUPPLY_URL(customSupplyId),
        formData,
        this.authOptions(),
      )
      .pipe(
        map((response) => assembleCustomSupply(response)),
        tap((updated) => {
          const reloadAccountId = accountId || updated.accountId || this.accountId();
          this.customSupplies.update((current) => {
            const index = current.findIndex((supply) => supply.id === customSupplyId);
            if (index === -1) return current;
            const updatedList = [...current];
            updatedList[index] = updated;
            return updatedList;
          });
          this.loadCustomSuppliesByAccount(reloadAccountId);
        }),
      );
  }

  deleteCustomSupply(customSupplyId: string, accountId: string): Observable<void> {
    return this.http.delete<void>(DELETE_CUSTOM_SUPPLY_URL(customSupplyId)).pipe(
      tap(() => {
        this.customSupplies.update((current) =>
          current.filter((supply) => supply.id !== customSupplyId),
        );
        this.loadCustomSuppliesByAccount(accountId);
      }),
    );
  }

  // ── Private ───────────────────────────────────────────────────────────────

  private fetchCustomSuppliesByAccount(accountId: string): Observable<CustomSupply[]> {
    return this.http
      .get<CustomSupplyListResponse | AccountCustomSuppliesResponse>(
        CUSTOM_SUPPLIES_BY_ACCOUNT_URL(accountId),
      )
      .pipe(
        map((response) => {
          const supplies = Array.isArray(response) ? response : response.supplies;
          return supplies
            .map((dto) => {
              try {
                return assembleCustomSupply(dto);
              } catch (error) {
                console.error('[ResourceStore] Failed to assemble custom supply', dto, error);
                return null;
              }
            })
            .filter((supply): supply is CustomSupply => supply !== null);
        }),
      );
  }

  private applyBranches(branches: Branch[]): void {
    this.branches.set(branches);

    const configuredBranchId = this.profilesStore.currentBranchId();
    const configuredBranch = branches.find((b) => b.id === configuredBranchId);
    const currentBranch = branches.find((b) => b.id === this.currentBranchId());
    const nextBranchId =
      configuredBranch?.id ?? currentBranch?.id ?? branches[0]?.id ?? '';

    this.currentBranchId.set(nextBranchId);
  }

  private rowsForBranch(rows: BatchRow[], branchId: string): BatchRow[] {
    if (!branchId) return rows;
    return rows.filter((row) => row.branchId === branchId);
  }

  private isNearExpiry(row: BatchRow): boolean {
    if (!row.expirationDate) return false;

    const expiration = new Date(row.expirationDate);
    const today = new Date();
    const thirtyDays = new Date(today);
    today.setHours(0, 0, 0, 0);
    thirtyDays.setDate(today.getDate() + 30);
    thirtyDays.setHours(0, 0, 0, 0);
    expiration.setHours(0, 0, 0, 0);

    return expiration >= today && expiration <= thirtyDays;
  }

  private handleAuthError(error: any): void {
    if (error.status === 401) {
      this.router.navigate(['/sign-in']);
    }
  }

  private authOptions(): { headers?: HttpHeaders } {
    const token = this.authService.currentUser()?.token;
    return token
      ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
      : {};
  }
}
