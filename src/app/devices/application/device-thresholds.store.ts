import { Injectable, signal } from '@angular/core';
import { catchError, EMPTY, finalize, Observable, tap } from 'rxjs';
import { DeviceThreshold } from '../domain/model/device-threshold.entity';
import { DevicesApi } from '../infrastructure/devices-api';
import { CreateDeviceThresholdRequest } from '../infrastructure/device-threshold/device-threshold.response';

@Injectable({ providedIn: 'root' })
export class DeviceThresholdsStore {
  readonly thresholds = signal<DeviceThreshold[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor(private readonly devicesApi: DevicesApi) {}

  loadThresholdsForAccount(accountId: string): void {
    if (!accountId) return;
    this.loading.set(true);
    this.error.set(null);
    this.devicesApi.getThresholdsByAccountId(accountId).pipe(
      tap(thresholds => this.thresholds.set(thresholds)),
      catchError(err => {
        this.error.set(err?.message ?? 'Failed to load thresholds');
        return EMPTY;
      }),
      finalize(() => this.loading.set(false)),
    ).subscribe();
  }

  createThreshold(body: CreateDeviceThresholdRequest): Observable<DeviceThreshold> {
    return this.devicesApi.createThreshold(body).pipe(
      tap(threshold => this.thresholds.update(list => [...list, threshold])),
    );
  }
}
