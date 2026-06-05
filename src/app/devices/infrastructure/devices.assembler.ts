import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {Device} from '../domain/model/device.entity';
import {DeviceResource, DevicesResponse} from './devices.response';

/**
 * Assembler for converting between Device entities and infrastructure resources.
 *
 * @remarks
 * This assembler is responsible for transforming between:
 * - {@link Device} - Domain entity for managing device state.
 * - {@link DeviceResource} - Infrastructure resource for API communication.
 * - {@link DevicesResponse} - API response from device list endpoint.
 */
export class DeviceAssembler implements BaseAssembler<Device, DeviceResource, DevicesResponse> {

  /**
   * Maps the response envelope to a list of domain entities.
   *
   * @param response - The response envelope containing device resources.
   * @returns A list of domain entities representing the devices.
   */
  toEntitiesFromResponse(response: DevicesResponse): Device[] {
    console.log(response);
    return response.devices.map(resource => this.toEntityFromResource(resource as DeviceResource));
  }

  /**
   * Maps a single device resource to a domain entity.
   *
   * @param resource - The device resource to map.
   * @returns A domain entity representing the device.
   */
  toEntityFromResource(resource: DeviceResource): Device {
    return new Device({
      id: resource.id,
      macAddress: resource.macAddress,
      assignedSupplyName: resource.assignedSupplyName,
      networkState: resource.networkState,
      sensorHealthPercentage: resource.sensorHealthPercentage,
    });
  }

  /**
   * Maps a domain entity to a device resource.
   *
   * @param entity - The domain entity to map.
   * @returns A device resource representing the domain entity.
   */
  toResourceFromEntity(entity: Device): DeviceResource {
    return {
      id: entity.id,
      macAddress: entity.macAddress,
      assignedSupplyName: entity.assignedSupplyName,
      networkState: entity.networkState,
      sensorHealthPercentage: entity.sensorHealthPercentage,
    } as DeviceResource;
  }
}
