import { BaseResource, BaseResponse } from '../../../shared/infrastructure/base-response';

/**
 * Resource representation of registered device data returned by register device endpoint.
 *
 * @remarks
 * This resource includes the identifier of the registered device, its assigned macAddress, and its current network state.
 */
export interface RegisterDeviceResource extends BaseResource {

  /**
   * The unique identifier of the created device
   */
  id: string;

  /**
   * The MAC address of the created device
   */
  macAddress: string;

  /**
   * The name of the assigned supply of the device.
   */
  assignedSupplyName: string;

  /**
   * The network state of the created device.
   */
  networkState: string;

  /**
   * The health percentage of the device's sensor.
   */
  sensorHealthPercentage: number;
}

/**
 * Response envelope returned by the register device endpoint.
 *
 * @remarks
 * This interface defines the structure of the API response from a successful device registration operation.
 */
export interface RegisterDeviceResponse extends BaseResponse, RegisterDeviceResource {}
