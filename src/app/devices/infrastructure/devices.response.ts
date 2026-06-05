import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a device for API communication.
 */
export interface DeviceResource extends BaseResource {

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
 * Response envelope for device collection queries.
 */
export interface DevicesResponse extends BaseResponse {

  /**
   * Array of device resources included in the response.
   * Contains zero or more device resources.
   */
  devices: DeviceResource[];
}
