import { BaseResource } from '../../../shared/infrastructure/base-response';

export interface DeviceThresholdResource extends BaseResource {
  id: string;
  accountId: string;
  customSupplyId: string;
  minStock: number;
  maxStock: number;
  anomalyThreshold: number;
  minTemperatureCelsius: number | null;
  maxTemperatureCelsius: number | null;
  minHumidityPercentage: number | null;
  maxHumidityPercentage: number | null;
}

export interface CreateDeviceThresholdRequest {
  deviceId: string;
  accountId: string;
  customSupplyId: string;
  minStock: number;
  maxStock: number;
  anomalyThreshold: number;
  minTemperatureCelsius?: number;
  maxTemperatureCelsius?: number;
  minHumidityPercentage?: number;
  maxHumidityPercentage?: number;
}
