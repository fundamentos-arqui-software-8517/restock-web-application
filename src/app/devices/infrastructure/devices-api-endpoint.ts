import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { Device } from '../domain/model/device.entity';
import { DeviceResource } from './devices.response';
import { DeviceAssembler } from './devices.assembler';
import {
  DEVICES_BY_ACCOUNT_URL,
  DEVICE_BY_ID_URL,
  CREATE_DEVICE_URL,
  ADD_SPECIFICATIONS_URL,
  ASSIGN_BRANCH_URL,
  ASSIGN_BATCH_URL,
  ASSIGN_THRESHOLD_URL,
  UPDATE_MEASUREMENT_URL,
  UPDATE_DEVICE_STATUS_URL,
  UPDATE_WITHDRAWN_STOCK_URL,
  UPDATE_DISPLAY_MODE_URL,
  DEVICES_HEALTH_URL,
} from './devices.endpoint';

export type DisplayMode =
  | 'DISPLAY_MODE_ENVIRONMENT'
  | 'DISPLAY_MODE_TEMPERATURE'
  | 'DISPLAY_MODE_HUMIDITY'
  | 'DISPLAY_MODE_WEIGHT'
  | 'DISPLAY_MODE_CONVERTED_UNITS';

export interface AddSpecificationsRequest {
  manufacturer: string;
  model: string;
  firmwareVersion: string;
}

export interface UpdateMeasurementRequest {
  unitStockWeight: number;
  tareWeight: number;
  grossWeight: number;
  calibrationDate: string;
  weightUnitName?: string;
  weightUnitAbbreviation?: string;
}

export class DevicesApiEndpoint extends ErrorHandlingEnabledBaseType {
  private readonly assembler = new DeviceAssembler();

  constructor(private readonly http: HttpClient) {
    super();
  }

  getDevicesByAccountId(accountId: string): Observable<Device[]> {
    return this.http.get<DeviceResource[]>(DEVICES_BY_ACCOUNT_URL(accountId)).pipe(
      map((resources) => this.assembler.toEntitiesFromArray(resources)),
      catchError(this.handleError('Failed to fetch devices')),
    );
  }

  getById(deviceId: string): Observable<Device> {
    return this.http.get<DeviceResource>(DEVICE_BY_ID_URL(deviceId)).pipe(
      map((r) => this.assembler.toEntityFromResource(r)),
      catchError(this.handleError('Failed to fetch device')),
    );
  }

  createDevice(body: {
    accountId: string;
    macAddress: string;
    description: string;
  }): Observable<Device> {
    return this.http.post<DeviceResource>(CREATE_DEVICE_URL(), body).pipe(
      map((r) => this.assembler.toEntityFromResource(r)),
      catchError(this.handleError('Failed to create device')),
    );
  }

  addSpecifications(deviceId: string, body: AddSpecificationsRequest): Observable<Device> {
    return this.http.patch<DeviceResource>(ADD_SPECIFICATIONS_URL(deviceId), body).pipe(
      map((r) => this.assembler.toEntityFromResource(r)),
      catchError(this.handleError('Failed to add specifications')),
    );
  }

  assignBranch(deviceId: string, branchId: string): Observable<Device> {
    return this.http.patch<DeviceResource>(ASSIGN_BRANCH_URL(deviceId), { branchId }).pipe(
      map((r) => this.assembler.toEntityFromResource(r)),
      catchError(this.handleError('Failed to assign branch')),
    );
  }

  assignBatch(deviceId: string, batchId: string): Observable<Device> {
    return this.http.patch<DeviceResource>(ASSIGN_BATCH_URL(deviceId), { batchId }).pipe(
      map((r) => this.assembler.toEntityFromResource(r)),
      catchError(this.handleError('Failed to assign batch')),
    );
  }

  assignThreshold(deviceId: string, supplyThresholdId: string): Observable<Device> {
    return this.http
      .patch<DeviceResource>(ASSIGN_THRESHOLD_URL(deviceId), { supplyThresholdId })
      .pipe(
        map((r) => this.assembler.toEntityFromResource(r)),
        catchError(this.handleError('Failed to assign threshold')),
      );
  }

  updateMeasurement(deviceId: string, body: UpdateMeasurementRequest): Observable<Device> {
    return this.http.patch<DeviceResource>(UPDATE_MEASUREMENT_URL(deviceId), body).pipe(
      map((r) => this.assembler.toEntityFromResource(r)),
      catchError(this.handleError('Failed to update measurement')),
    );
  }

  updateStatus(deviceId: string, status: 'CALIBRATED' | 'INACTIVE'): Observable<Device> {
    return this.http.patch<DeviceResource>(UPDATE_DEVICE_STATUS_URL(deviceId), { status }).pipe(
      map((r) => this.assembler.toEntityFromResource(r)),
      catchError(this.handleError('Failed to update device status')),
    );
  }

  updateDisplayMode(deviceId: string, displayMode: DisplayMode): Observable<Device> {
    return this.http.patch<DeviceResource>(UPDATE_DISPLAY_MODE_URL(deviceId), { displayMode }).pipe(
      map((r) => this.assembler.toEntityFromResource(r)),
      catchError(this.handleError('Failed to update display mode')),
    );
  }

  updateWithdrawnStock(deviceId: string, amount: number): Observable<Device> {
    return this.http.patch<DeviceResource>(UPDATE_WITHDRAWN_STOCK_URL(deviceId), { amount }).pipe(
      map((r) => this.assembler.toEntityFromResource(r)),
      catchError(this.handleError('Failed to update withdrawn stock')),
    );
  }

  getDeviceHealthLogs(deviceId: string): Observable<unknown> {
    return this.http
      .get<unknown>(DEVICES_HEALTH_URL(deviceId))
      .pipe(catchError(this.handleError('Failed to fetch device health logs')));
  }
}
