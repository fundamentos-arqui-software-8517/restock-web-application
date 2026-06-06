import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { ErrorHandlingEnabledBaseType } from '../../../shared/infrastructure/error-handling-enabled-base-type';
import { DeviceThreshold } from '../../domain/model/device-threshold.entity';
import { DeviceThresholdAssembler } from './device-threshold.assembler';
import { CreateDeviceThresholdRequest, DeviceThresholdResource } from './device-threshold.response';
import {
  THRESHOLDS_BY_ACCOUNT_URL,
  CREATE_THRESHOLD_URL,
  THRESHOLD_BY_ID_URL,
} from '../devices.endpoint';

export class DeviceThresholdApiEndpoint extends ErrorHandlingEnabledBaseType {
  private readonly assembler = new DeviceThresholdAssembler();

  constructor(private readonly http: HttpClient) {
    super();
  }

  getThresholdsByAccountId(accountId: string): Observable<DeviceThreshold[]> {
    return this.http.get<DeviceThresholdResource[]>(THRESHOLDS_BY_ACCOUNT_URL(accountId)).pipe(
      map(resources => this.assembler.toEntitiesFromArray(resources)),
      catchError(this.handleError('Failed to fetch thresholds')),
    );
  }

  getThresholdById(thresholdId: string): Observable<DeviceThreshold> {
    return this.http.get<DeviceThresholdResource>(THRESHOLD_BY_ID_URL(thresholdId)).pipe(
      map(r => this.assembler.toEntityFromResource(r)),
      catchError(this.handleError('Failed to fetch threshold')),
    );
  }

  createThreshold(body: CreateDeviceThresholdRequest): Observable<DeviceThreshold> {
    return this.http.post<DeviceThresholdResource>(CREATE_THRESHOLD_URL(), body).pipe(
      map(r => this.assembler.toEntityFromResource(r)),
      catchError(this.handleError('Failed to create threshold')),
    );
  }
}
