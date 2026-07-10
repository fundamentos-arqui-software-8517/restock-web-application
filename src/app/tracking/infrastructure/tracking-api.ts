import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';

import {
  DISCREPANCY_ENDPOINT,
  DISCREPANCY_BY_ID_URL,
} from './discrepancy/discrepancy.endpoint';
import type { DiscrepancyDetailResponse, DiscrepancyItemResponse } from './discrepancy/discrepancy.response';
import { assembleDiscrepancy, assembleDiscrepancyRow } from './discrepancy/discrepancy.assembler';

import {
  CONCILIATION_TASKS_URL,
  CONCILIATION_TASK_BY_ID_URL,
  RESOLVE_CONCILIATION_TASK_URL,
} from './conciliation-task/conciliation-task.endpoint';
import type {
  ConciliationTaskResponse,
  ConciliationTaskListResponse,
  ConciliationTaskQueryParams,
  ResolveConciliationTaskRequest,
} from './conciliation-task/conciliation-task.response';
import { assembleConciliationTaskRow, type ConciliationTaskRow } from './conciliation-task/conciliation-task.assembler';

import { TELEMETRY_ENDPOINT } from './telemetry/telemetry.endpoint';
import { assembleTelemetryReading } from './telemetry/telemetry.assembler';


import { DEVICE_HEALTH_ENDPOINT, RECALIBRATE_DEVICE_URL } from './device-health/device-health.endpoint';
import type { DeviceHealthCheckResponse } from './device-health/device-health.response';
import { assembleDeviceHealthCheck } from './device-health/device-health.assembler';
import { Discrepancy } from '../domain/model/discrepancy.entity';
import { TelemetryReading } from '../domain/model/telemetry-reading.entity';
import { DeviceHealthCheck } from '../domain/model/device-health-check.entity';


/**
 * HTTP entry point for the Tracking bounded context.
 *
 * Centralises access to discrepancy, conciliation task, telemetry,
 * and device health data from the backend APIs.
 */
@Injectable({ providedIn: 'root' })
export class TrackingApi {
  private readonly http = inject(HttpClient);

  /**
   * Loads discrepancy list items.
   *
   * @param params Optional query parameters.
   * @returns An observable with assembled discrepancy rows.
   */
  getDiscrepancies(params?: HttpParams): Observable<ReturnType<typeof assembleDiscrepancyRow>[]> {
    return this.http
      .get<DiscrepancyItemResponse[]>(DISCREPANCY_ENDPOINT, { params })
      .pipe(map((items) => items.map(assembleDiscrepancyRow)));
  }

  /**
   * Loads a single discrepancy by its identifier.
   *
   * @param id The discrepancy identifier.
   * @returns An observable with the domain entity.
   */
  getDiscrepancyById(id: string): Observable<Discrepancy> {
    return this.http
      .get<DiscrepancyDetailResponse>(DISCREPANCY_BY_ID_URL(id))
      .pipe(map(assembleDiscrepancy));
  }

  /**
   * GET /api/v1/conciliation-tasks?accountId=&status=&...
   */
  getConciliationTasks(params: ConciliationTaskQueryParams): Observable<ConciliationTaskRow[]> {
    let httpParams = new HttpParams().set('accountId', params.accountId);
    if (params.status)         httpParams = httpParams.set('status', params.status);
    if (params.customSupplyId) httpParams = httpParams.set('customSupplyId', params.customSupplyId);
    if (params.branchId)       httpParams = httpParams.set('branchId', params.branchId);
    if (params.deviceId)       httpParams = httpParams.set('deviceId', params.deviceId);

    return this.http
      .get<ConciliationTaskListResponse>(CONCILIATION_TASKS_URL, { params: httpParams })
      .pipe(map((items) => items.map(assembleConciliationTaskRow)));
  }

  getConciliationTaskById(conciliationTaskId: string): Observable<ConciliationTaskRow> {
    return this.http
      .get<ConciliationTaskResponse>(CONCILIATION_TASK_BY_ID_URL(conciliationTaskId))
      .pipe(map(assembleConciliationTaskRow));
  }

  resolveConciliationTask(
    conciliationTaskId: string,
    body: ResolveConciliationTaskRequest,
  ): Observable<ConciliationTaskRow> {
    return this.http
      .post<ConciliationTaskResponse>(RESOLVE_CONCILIATION_TASK_URL(conciliationTaskId), body)
      .pipe(map(assembleConciliationTaskRow));
  }

  /**
   * Loads telemetry readings for a given device.
   *
   * @param deviceId The device identifier.
   * @returns An observable with telemetry domain entities.
   */
  getTelemetryReadings(deviceId: string): Observable<TelemetryReading[]> {
    const params = new HttpParams().set('deviceId', deviceId);

    return this.http
      .get<any[]>(TELEMETRY_ENDPOINT, { params })
      .pipe(map((items) => items.map(assembleTelemetryReading)));
  }

  /**
   * Loads device health checks for a given device.
   *
   * @param deviceId The device identifier.
   * @returns An observable with device health domain entities.
   */
  getDeviceHealthChecks(deviceId: string): Observable<DeviceHealthCheck[]> {
    const params = new HttpParams().set('deviceId', deviceId);

    return this.http
      .get<DeviceHealthCheckResponse[]>(DEVICE_HEALTH_ENDPOINT, { params })
      .pipe(map((items) => items.map(assembleDeviceHealthCheck)));
  }

  /**
   * Sends a recalibration request for a device.
   *
   * @param deviceId The device identifier.
   * @param action The calibration action.
   * @param note Optional note for the recalibration.
   * @returns An observable that completes when recalibration is requested.
   */
  recalibrateDevice(deviceId: string, action: string, note: string): Observable<void> {
    return this.http.post<void>(RECALIBRATE_DEVICE_URL(deviceId), { action, note });
  }
}
