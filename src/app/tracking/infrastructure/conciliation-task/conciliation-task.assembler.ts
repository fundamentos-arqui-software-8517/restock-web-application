import type { ConciliationTaskResponse } from './conciliation-task.response';

/**
 * UI-friendly row assembled from a ConciliationTaskResponse.
 * Used in the store and presentation layer.
 */
export interface ConciliationTaskRow {
  id: string;
  customSupplyId: string;
  customSupplyName: string;
  deviceId: string;
  branchId: string;
  batchId: string;
  digitalStock: number;
  devicePhysicalStock: number;
  difference: number;
  alertLevel: string;
  status: string;
  resolutionAction: string | null;
  resolutionReason: string | null;
  resolutionJustification: string | null;
  resolvedAt: string | null;
}

/**
 * Assembles a ConciliationTaskResponse into a UI row.
 */
export function assembleConciliationTaskRow(dto: ConciliationTaskResponse): ConciliationTaskRow {
  return {
    id: dto.id,
    customSupplyId: dto.customSupplyId,
    customSupplyName: dto.customSupplyName,
    deviceId: dto.deviceId,
    branchId: dto.branchId,
    batchId: dto.batchId,
    digitalStock: dto.digitalStock,
    devicePhysicalStock: dto.devicePhysicalStock,
    difference: dto.difference,
    alertLevel: dto.alertLevel,
    status: dto.status,
    resolutionAction: dto.resolutionAction,
    resolutionReason: dto.resolutionReason,
    resolutionJustification: dto.resolutionJustification,
    resolvedAt: dto.resolvedAt,
  };
}
