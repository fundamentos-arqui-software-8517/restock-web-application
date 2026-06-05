import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {Device} from '../domain/model/device.entity';
import {DeviceResource, DevicesResponse} from './devices.response';
import {DeviceAssembler} from './devices.assembler';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable} from 'rxjs';
import {RegisterDeviceResponse} from './register-device/register-device.response';

/**
 * HTTP endpoint URL for Device Management API operations.
 */
const devicesApiEndpointUrl = '';

/**
 * HTTP endpoint URL for retrieving devices for a specific account.
 */
const accountDevicesApiEndpointUrl = '';

/**
 * HTTP endpoint client for Device Management API operations.
 *
 * @remarks
 * This endpoint encapsulates HTTP communication for Device Management API operations.
 */
export class DevicesApiEndpoint extends BaseApiEndpoint<Device, DeviceResource, DevicesResponse, DeviceAssembler> {

  /**
   * Creates an instance of DevicesApiEndpoint.
   *
   * @param http - Angular HttpClient for making HTTP requests.
   */
  constructor(http: HttpClient) {
    super(http, devicesApiEndpointUrl, new DeviceAssembler());
  }

  /**
   * Retrieves a list of devices for a specified account.
   *
   * @param accountId - The unique identifier of the account to retrieve devices for.
   * @returns Observable stream emitting the list of device resources.
   */
  getDevicesByAccountId(accountId: string): Observable<Device[]> {
    return this.http
      .get<DevicesResponse>(accountDevicesApiEndpointUrl.replace('accountId', accountId))
      .pipe(map(response=>
        this.assembler.toEntitiesFromResponse(response)),
        catchError(this.handleError('Failed to retrieve devices for the account.'))
      );
  }
}
