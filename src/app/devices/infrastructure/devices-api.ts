import { BaseApi } from '../../shared/infrastructure/base-api';
import { Injectable } from '@angular/core';
import { RegisterDeviceApiEndpoint } from './register-device/register-device-api-endpoint';
import { HttpClient } from '@angular/common/http';
import { RegisterDeviceAssembler } from './register-device/register-device.assembler';
import { RegisterDeviceCommand } from '../domain/model/register-device.command';
import { Observable } from 'rxjs';
import { RegisterDeviceResource } from './register-device/register-device.response';
import {Device} from '../domain/model/device.entity';
import {DevicesApiEndpoint} from './devices-api-endpoint';
import {DeviceAssembler} from './devices.assembler';

/**
 * Application service facade for Device Management domain API operations.
 *
 * @remarks
 * This service acts as the application layer facade coordinating access to Device Management domain resources through HTTP endpoints.
 *
 * Each operation is delegated to specialized endpoint clients:
 * - RegisterDevicApiEndpoint: Handles device registration operations.
 */
@Injectable({providedIn: 'root'})
export class DevicesApi extends BaseApi {

  /**
   * Endpoint client for device registration operations.
   * @private
   */
  private readonly registerDeviceEndpoint: RegisterDeviceApiEndpoint;

  /**
   * Endpoint client for device list operations.
   * @private
   */
  private readonly devicesEndpoint: DevicesApiEndpoint;

  /**
   * Creates an instance of DevicesApi.
   *
   * @param http - Angular HttpClient for making HTTP requests.
   */
  constructor(http: HttpClient) {
    super();
    this.registerDeviceEndpoint = new RegisterDeviceApiEndpoint(http, new RegisterDeviceAssembler());
    this.devicesEndpoint = new DevicesApiEndpoint(http);
  }

  /**
   * Retrieves a list of devices for a specified account.
   *
   * @param accountId - The unique identifier of the account to retrieve devices for.
   * @returns Observable stream emitting the list of device resources.
   */
  getDevicesByAccountId(accountId: string): Observable<Device[]> {
    return this.devicesEndpoint.getDevicesByAccountId(accountId);
  }

  /**
   * Retrieves a single device by its ID.
   *
   * @param id - The unique identifier of the device to retrieve.
   * @returns Observable stream emitting the device resource.
   */
  getDeviceById(id: string): Observable<Device> {
    return this.devicesEndpoint.getById(id);
  }

  /**
   * Registers a new device in the Device Management domain.
   *
   * @param registerDeviceCommand - Domain command containing device registration information.
   * @returns Observable stream emitting the registered device resource.
   */
  registerDevice(registerDeviceCommand: RegisterDeviceCommand): Observable<Device> {
    return this.registerDeviceEndpoint.registerDevice(registerDeviceCommand);
  }
}
