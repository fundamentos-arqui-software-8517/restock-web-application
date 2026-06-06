import { Device } from '../domain/model/device.entity';
import { DeviceResource } from './devices.response';
import { DeviceStatus } from '../domain/model/device-status';

export class DeviceAssembler {
  toEntityFromResource(resource: DeviceResource): Device {
    return new Device({
      id: resource.id,
      accountId: resource.accountId,
      macAddress: resource.macAddress,
      description: resource.description,
      status: resource.status as DeviceStatus,
      manufacturer: resource.manufacturer,
      model: resource.model,
      firmwareVersion: resource.firmwareVersion,
      branchId: resource.branchId,
      assignedBatchId: resource.assignedBatchId,
      supplyThresholdId: resource.supplyThresholdId,
      netWeight: resource.netWeight,
      tareWeight: resource.tareWeight,
      grossWeight: resource.grossWeight,
      calibrationDate: resource.calibrationDate,
      weightUnitName: resource.weightUnitName,
      weightUnitAbbreviation: resource.weightUnitAbbreviation,
      justifiedWithdrawnStock: resource.justifiedWithdrawnStock,
    });
  }

  toEntitiesFromArray(resources: DeviceResource[]): Device[] {
    return resources.map(r => this.toEntityFromResource(r));
  }
}
