import { ErrorHandlingEnabledBaseType } from '../../../shared/infrastructure/error-handling-enabled-base-type';
import { HttpClient } from '@angular/common/http';
import { RegisterDeviceAssembler } from './register-device.assembler';
import { RegisterDeviceCommand } from '../../domain/model/register-device.command';
import { catchError, map, Observable } from 'rxjs';
import { RegisterDeviceResource, RegisterDeviceResponse } from './register-device.response';
import {Device} from '../../domain/model/device.entity';

/**
 * Endpoint for the device registration operation.
 */
const registerDeviceApiEndpointUrl = '';

/**
 * HTTP endpoint client for device registration operations.
 *
 * @remarks
 * This endpoint encapsulate HTTP communication for the device registration operation.
 */
export class RegisterDeviceApiEndpoint extends ErrorHandlingEnabledBaseType {

  /**
   * Creates an instance of RegisterDeviceApiEndpoint.
   *
   * @param http - Angular HttpClient for making HTTP requests.
   * @param assembler - The assembler for converting between commands, requests, and responses.
   */
  constructor(private http: HttpClient, private assembler: RegisterDeviceAssembler) {
    super();
  }

  /**
   * Registers a device for a specified account with the Device Management endpoint.
   *
   * @param registerDeviceCommand - Domain command containing required details for registering a device.
   * @returns Observable stream emitting the registered device resource.
   *
   * @remarks
   * The device registration process:
   * 1. Converts the RegisterDeviceCommand to a RegisterDeviceRequest using the assembler.
   * 2. Sends an HTTP POST request to the device registration endpoint with the request payload.
   * 3. On success, converts the RegisterDeviceResponse to a RegisterDeviceResource for application use.
   * 4. On failure, transforms the error into a meaningful error message in the system.
   */
  registerDevice(registerDeviceCommand: RegisterDeviceCommand): Observable<Device> {
    const registerDeviceRequest = this.assembler.toRequestFromCommand(registerDeviceCommand);
    return this.http
      .post<RegisterDeviceResponse>(registerDeviceApiEndpointUrl, registerDeviceRequest)
      .pipe(map(response =>
          this.assembler.toResourceFromResponse(response)), catchError(this.handleError('Failed to register a device.'))
      );
  }
}
