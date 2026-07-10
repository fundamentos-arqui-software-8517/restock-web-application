import type { TelemetryReadingResponse } from './telemetry.response';
import { TelemetryReading } from '../../domain/model/telemetry-reading.entity';



/**
 * Assembles a telemetry reading response into a domain entity.
 *
 * @param dto Telemetry reading received from the API.
 * @returns A TelemetryReading domain entity.
 */
export function assembleTelemetryReading(dto: TelemetryReadingResponse): TelemetryReading {
  return TelemetryReading.create(
    dto.id,
    dto.timestamp,
    dto.physicalStock,
    dto.temperature,
    dto.humidity,
    dto.deviceId,
  );
}
