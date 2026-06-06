import { BaseResource } from '../../../shared/infrastructure/base-response';

export interface DeviceThresholdResource extends BaseResource {
  id: string;
  accountId: string;
  customSupplyId: string;
  minStock: number;
  maxStock: number;
  anomalyThreshold: number;
  minTemperature: number | null;
  maxTemperature: number | null;
  minHumidity: number | null;
  maxHumidity: number | null;
}

export interface CreateDeviceThresholdRequest {
  accountId: string;
  customSupplyId: string;
  minStock: number;
  maxStock: number;
  anomalyThreshold: number;
  minTemperature?: number;
  maxTemperature?: number;
  minHumidity?: number;
  maxHumidity?: number;
}
