export interface CreateTelemetryReadingCommand {
  deviceId: string;
  timestamp: string;
  physicalStock: number;
  temperature: number;
  humidity: number;
}
