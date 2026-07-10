/**
 * Represents a record of physical or system stock at a given point in time.
 */
export interface StockRecord {
  value: number;
  unit: string;
  recordedAt: string;
}

/**
 * Represents a temperature reading from an IoT device.
 */
export interface TemperatureRecord {
  value: number;
  unit: string;
  recordedAt: string;
}

/**
 * Represents a humidity reading from an IoT device.
 */
export interface HumidityRecord {
  value: number;
  unit: string;
  recordedAt: string;
}

/**
 * Represents the signal strength of an IoT device.
 */
export interface SignalStrength {
  value: number;
  unit: string;
}
