import { DeviceThreshold } from '../../domain/model/device-threshold.entity';
import { DeviceThresholdResource } from './device-threshold.response';

export class DeviceThresholdAssembler {
  toEntityFromResource(resource: DeviceThresholdResource): DeviceThreshold {
    return new DeviceThreshold({
      id: resource.id,
      accountId: resource.accountId,
      customSupplyId: resource.customSupplyId,
      minStock: resource.minStock,
      maxStock: resource.maxStock,
      anomalyThreshold: resource.anomalyThreshold,
      minTemperature: resource.minTemperatureCelsius,
      maxTemperature: resource.maxTemperatureCelsius,
      minHumidity: resource.minHumidityPercentage,
      maxHumidity: resource.maxHumidityPercentage,
    });
  }

  toEntitiesFromArray(resources: DeviceThresholdResource[]): DeviceThreshold[] {
    return resources.map(r => this.toEntityFromResource(r));
  }
}
