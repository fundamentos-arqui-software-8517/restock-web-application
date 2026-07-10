import type { DiscrepancyDetailResponse, DiscrepancyItemResponse } from './discrepancy.response';
import { DiscrepancyLevel } from '../../domain/model/enums';
import { Discrepancy } from '../../domain/model/discrepancy.entity';

/**
 * Assembles a discrepancy detail response into a domain entity.
 *
 * @param dto Discrepancy detail received from the API.
 * @returns A Discrepancy domain entity.
 */
export function assembleDiscrepancy(dto: DiscrepancyDetailResponse): Discrepancy {
  return Discrepancy.create(
    dto.id,
    toDiscrepancyLevel(dto.level),
    {
      value: dto.physicalStock.value,
      unit: dto.physicalStock.unit,
      recordedAt: dto.physicalStock.recordedAt,
    },
    {
      value: dto.systemStock.value,
      unit: dto.systemStock.unit,
      recordedAt: dto.systemStock.recordedAt,
    },
    dto.deviceId,
  );
}

/**
 * Assembles a discrepancy list item into a UI-friendly row.
 *
 * @param dto Discrepancy item received from the API.
 * @returns A flat discrepancy row object.
 */
export function assembleDiscrepancyRow(dto: DiscrepancyItemResponse): {
  id: string;
  supplyName: string;
  deviceId: string;
  digitalStock: number;
  physicalStock: number;
  deviation: number;
  severity: string;
  detectionTime: string;
  status: string;
} {
  return {
    id: dto.id,
    supplyName: dto.supplyName,
    deviceId: dto.deviceId,
    digitalStock: dto.digitalStock,
    physicalStock: dto.physicalStock,
    deviation: dto.deviation,
    severity: dto.severity,
    detectionTime: dto.detectionTime,
    status: dto.status,
  };
}

function toDiscrepancyLevel(level: string): DiscrepancyLevel {
  switch (level.toUpperCase()) {
    case 'CRITICAL':
      return DiscrepancyLevel.CRITICAL;
    case 'HIGH':
      return DiscrepancyLevel.HIGH;
    case 'MEDIUM':
      return DiscrepancyLevel.MEDIUM;
    case 'LOW':
      return DiscrepancyLevel.LOW;
    default:
      return DiscrepancyLevel.LOW;
  }
}
