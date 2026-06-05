import {computed, Injectable, Signal, signal} from '@angular/core';
import {Device} from '../domain/model/device.entity';
import {DevicesApi} from '../infrastructure/devices-api';
import {RegisterDeviceCommand} from '../domain/model/register-device.command';
import {retry} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

/**
 * Application service managing Device Management domain state and orchestration.
 *
 * @remarks
 * This is an application service that:
 * - Manages the state of the Device Management domain, including devices, loading status, and error messages.
 * - Orchestrates the registration of new devices with the remote system.
 * - Handles error handling and formatting for user-friendly messages.
 *
 * The store maintains the main aggregate of the domain:
 * - Devices: A list of registered devices.
 */
@Injectable({providedIn: "root"})
export class DevicesStore {

  /**
   * Signal representing the list of registered devices.
   * @private
   */
  private readonly _devicesSignal = signal<Device[]>([]);

  /**
   * Readonly signal representing the loading status of the device registration process.
   */
  readonly devices = this._devicesSignal.asReadonly();

  /**
   * Signal representing the loading status of the device registration process.
   * @private
   */
  private readonly _loadingSignal = signal<boolean>(false);

  /**
   * Readonly signal representing the loading status of the device registration process.
   */
  readonly loading = this._loadingSignal.asReadonly();

  /**
   * Signal representing the error message if any occurred during the device registration process.
   * @private
   */
  private readonly _errorSignal = signal<string | null>(null);

  /**
   * Readonly signal representing the error message if any occurred during the device registration process.
   */
  readonly error = this._errorSignal.asReadonly();

  /**
   * Creates an instance of DevicesStore.
   *
   * @param devicesApi - The DevicesApi service used for communication with the remote system.
   */
  constructor(private devicesApi: DevicesApi) {}

  /**
   * Formats error messages for display to users or logs.
   *
   * @param error - The error object to format
   * @param fallback - The fallback message if error format is unknown
   * @returns A human-readable error message
   *
   * @private
   */
  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Device not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  }

  /**
   * Loads the list of devices for a specific account.
   *
   * @param accountId - The unique identifier of the account to load devices for.
   */
  loadDevicesForAccount(accountId: string): void {
    this._loadingSignal.set(true);
    this._errorSignal.set(null);
    this.devicesApi.getDevicesByAccountId(accountId)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: devices => {
          console.log(devices);
          this._devicesSignal.set(devices);
          this._loadingSignal.set(false);
          this._errorSignal.set(null);
        },
        error: err => {
          this._loadingSignal.set(false);
          this._errorSignal.set(this.formatError(err, 'Failed to load devices'));
        }
      })
  }

  /**
   * Gets a signal representing the device with the specified ID.
   *
   * @param id - The unique identifier of the device to retrieve.
   * @returns A signal representing the device with the specified ID, or undefined if not found.
   */
  getDeviceById(id: string): Signal<Device | undefined> {
    return computed(() => id
      ? this.devices().find(device => device.id === id) : undefined);
  }

  /**
   * Registers a new device to the store and remote system.
   *
   * @param registerDeviceCommand - The command containing the device registration data.
   */
  registerDevice(registerDeviceCommand: RegisterDeviceCommand): void {
    this._loadingSignal.set(true);
    this._errorSignal.set(null);
    this.devicesApi.registerDevice(registerDeviceCommand)
      .pipe(retry(2))
      .subscribe({
        next: registeredDevice => {
          this._devicesSignal.update(devices => [...devices, registeredDevice]);
          this._loadingSignal.set(false);
          this._errorSignal.set(null);
        },
        error: err => {
          this._loadingSignal.set(false);
          this._errorSignal.set(this.formatError(err, 'Failed to register device'));
        }
      });
  }
}
