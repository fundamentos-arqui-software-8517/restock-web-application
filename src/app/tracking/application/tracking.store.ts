import { Injectable, inject, signal } from '@angular/core';
import { EMPTY, catchError, finalize, tap } from 'rxjs';

import { TrackingApi } from '../infrastructure/tracking-api';
import type { ConciliationTaskRow } from '../infrastructure/conciliation-task/conciliation-task.assembler';
import type { ResolveConciliationTaskRequest } from '../infrastructure/conciliation-task/conciliation-task.response';
import { Discrepancy } from '../domain/model/discrepancy.entity';

/**
 * View-model representation of a discrepancy row in the UI.
 */
export interface DiscrepancyRow {
  id: string;
  supplyName: string;
  deviceId: string;
  digitalStock: number;
  physicalStock: number;
  deviation: number;
  severity: string;
  detectionTime: string;
  status: string;
}

/**
 * Store responsible for managing the Tracking bounded context state.
 */
@Injectable({ providedIn: 'root' })
export class TrackingStore {
  readonly loading = signal(false);
  readonly loadError = signal(false);

  readonly discrepancies = signal<DiscrepancyRow[]>([]);
  readonly conciliationTasks = signal<ConciliationTaskRow[]>([]);
  readonly selectedDiscrepancy = signal<Discrepancy | null>(null);
  readonly selectedConciliationTask = signal<ConciliationTaskRow | null>(null);

  readonly pendingTasksCount = signal(0);
  readonly totalResolved = signal(0);
  readonly currentAccountId = signal('');

  private readonly trackingApi = inject(TrackingApi);

  // ─── Discrepancies ────────────────────────────────────────────────────────

  loadDiscrepancies(): void {
    this.loading.set(true);
    this.loadError.set(false);

    this.trackingApi
      .getDiscrepancies()
      .pipe(
        tap((data) => {
          this.discrepancies.set(data);
          this.pendingTasksCount.set(data.filter((d) => d.status === 'PENDING_REVIEW').length);
        }),
        catchError(() => {
          this.loadError.set(true);
          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe();
  }

  loadDiscrepancyById(id: string): void {
    this.loading.set(true);
    this.loadError.set(false);

    this.trackingApi
      .getDiscrepancyById(id)
      .pipe(
        tap((data) => this.selectedDiscrepancy.set(data)),
        catchError(() => {
          this.loadError.set(true);
          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe();
  }


  /**
   * GET /api/v1/conciliation-tasks?accountId=&status=&...
   */
  loadConciliationTasks(accountId: string, status?: 'PENDING' | 'RESOLVED_MANUALLY' | 'RESOLVED_AUTOMATICALLY'): void {
    this.loading.set(true);
    this.loadError.set(false);

    this.trackingApi
      .getConciliationTasks({ accountId, status })
      .pipe(
        tap((tasks) => {
          this.conciliationTasks.set(tasks);
          this.pendingTasksCount.set(tasks.filter((t) => t.status === 'PENDING').length);
          this.totalResolved.set(tasks.filter((t) => t.status !== 'PENDING').length);
        }),
        catchError(() => {
          this.loadError.set(true);
          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe();
  }

  /**
   * GET /api/v1/conciliation-tasks/{id}
   */
  loadConciliationTaskById(conciliationTaskId: string): void {
    this.loading.set(true);
    this.loadError.set(false);

    this.trackingApi
      .getConciliationTaskById(conciliationTaskId)
      .pipe(
        tap((task) => this.selectedConciliationTask.set(task)),
        catchError(() => {
          this.loadError.set(true);
          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe();
  }

  resolveConciliationTask(
    conciliationTaskId: string,
    body: ResolveConciliationTaskRequest,
  ): void {
    this.loading.set(true);

    this.trackingApi
      .resolveConciliationTask(conciliationTaskId, body)
      .pipe(
        tap((resolved) => {
          this.conciliationTasks.update((tasks) =>
            tasks.map((t) => (t.id === conciliationTaskId ? resolved : t)),
          );
          this.selectedConciliationTask.set(resolved);
        }),
        catchError(() => {
          this.loadError.set(true);
          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe();
  }

  recalibrateScale(deviceId: string, action: string, note: string): void {
    this.loading.set(true);

    this.trackingApi
      .recalibrateDevice(deviceId, action, note)
      .pipe(
        tap(() => this.loadDiscrepancies()),
        catchError(() => {
          this.loadError.set(true);
          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe();
  }
}
