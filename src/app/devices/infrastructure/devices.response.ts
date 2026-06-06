import { BaseResource } from '../../shared/infrastructure/base-response';

export interface DeviceResource extends BaseResource {
  id: string;
  accountId: string;
  macAddress: string;
  description: string;
  status: string;
  manufacturer: string | null;
  model: string | null;
  firmwareVersion: string | null;
  branchId: string | null;
  assignedBatchId: string | null;
  supplyThresholdId: string | null;
  netWeight: number | null;
  tareWeight: number | null;
  grossWeight: number | null;
  calibrationDate: string | null;
  weightUnitName: string | null;
  weightUnitAbbreviation: string | null;
  justifiedWithdrawnStock: number;
}
