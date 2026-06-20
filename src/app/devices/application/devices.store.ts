import { Injectable, inject, signal } from '@angular/core';
import { catchError, EMPTY, finalize, Observable, tap } from 'rxjs';
import { Device } from '../domain/model/device.entity';
import { DevicesApi } from '../infrastructure/devices-api';
import { AddSpecificationsRequest, UpdateMeasurementRequest } from '../infrastructure/devices-api-endpoint';
import { MqttRealtimeService } from '../../shared/infrastructure/mqtt/mqtt-realtime.service';

@Injectable({ providedIn: 'root' })
export class DevicesStore {
  readonly devices = signal<Device[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  private readonly mqttRealtimeService = inject(MqttRealtimeService);

  constructor(private readonly devicesApi: DevicesApi) {
    this.mqttRealtimeService.getDeviceUpdates().subscribe((update) => {
      console.log('[DevicesStore] Received real-time device telemetry update:', update);
      this.devices.update(list => list.map(d => {
        if (d.id === update.deviceId) {
          return new Device({
            id: d.id,
            accountId: d.accountId,
            macAddress: d.macAddress,
            description: d.description,
            status: update.status as any,
            manufacturer: d.manufacturer,
            model: d.model,
            firmwareVersion: d.firmwareVersion,
            branchId: update.branchId,
            assignedBatchId: update.assignedBatchId,
            supplyThresholdId: d.supplyThresholdId,
            netWeight: update.netWeight,
            tareWeight: update.tareWeight,
            grossWeight: update.grossWeight,
            calibrationDate: new Date().toISOString(),
            weightUnitName: update.weightUnitName,
            weightUnitAbbreviation: update.weightUnitAbbr,
            justifiedWithdrawnStock: d.justifiedWithdrawnStock
          });
        }
        return d;
      }));
    });
  }

  loadDevicesForAccount(accountId: string): void {
    if (!accountId) return;
    this.loading.set(true);
    this.error.set(null);
    this.devicesApi.getDevicesByAccountId(accountId).pipe(
      tap(devices => this.devices.set(devices)),
      catchError(err => {
        this.error.set(err?.message ?? 'Failed to load devices');
        return EMPTY;
      }),
      finalize(() => this.loading.set(false)),
    ).subscribe();
  }

  getDeviceById(id: string): Device | undefined {
    return this.devices().find(d => d.id === id);
  }

  createDevice(body: { accountId: string; macAddress: string; description: string }): Observable<Device> {
    return this.devicesApi.createDevice(body).pipe(
      tap(device => this.devices.update(list => [...list, device])),
    );
  }

  addSpecifications(deviceId: string, body: AddSpecificationsRequest): Observable<Device> {
    return this.devicesApi.addSpecifications(deviceId, body).pipe(
      tap(updated => this._replaceDevice(updated)),
    );
  }

  assignBranch(deviceId: string, branchId: string): Observable<Device> {
    return this.devicesApi.assignBranch(deviceId, branchId).pipe(
      tap(updated => this._replaceDevice(updated)),
    );
  }

  assignBatch(deviceId: string, batchId: string): Observable<Device> {
    return this.devicesApi.assignBatch(deviceId, batchId).pipe(
      tap(updated => this._replaceDevice(updated)),
    );
  }

  assignThreshold(deviceId: string, supplyThresholdId: string): Observable<Device> {
    return this.devicesApi.assignThreshold(deviceId, supplyThresholdId).pipe(
      tap(updated => this._replaceDevice(updated)),
    );
  }

  updateMeasurement(deviceId: string, body: UpdateMeasurementRequest): Observable<Device> {
    return this.devicesApi.updateMeasurement(deviceId, body).pipe(
      tap(updated => this._replaceDevice(updated)),
    );
  }

  updateStatus(deviceId: string, status: 'CONFIGURED' | 'INACTIVE'): Observable<Device> {
    return this.devicesApi.updateStatus(deviceId, status).pipe(
      tap(updated => this._replaceDevice(updated)),
    );
  }

  updateWithdrawnStock(deviceId: string, amount: number): Observable<Device> {
    return this.devicesApi.updateWithdrawnStock(deviceId, amount).pipe(
      tap(updated => this._replaceDevice(updated)),
    );
  }

  private _replaceDevice(updated: Device): void {
    this.devices.update(list => list.map(d => d.id === updated.id ? updated : d));
  }
}
