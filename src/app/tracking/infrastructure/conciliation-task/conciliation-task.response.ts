/**
 * Response shape for GET /api/v1/conciliation-tasks
 * and GET /api/v1/conciliation-tasks/{conciliationTaskId}
 */
export interface ConciliationTaskResponse {
  id: string;
  discrepancyId: string;
  stockComparisonTaskId: string;
  accountId: string;
  branchId: string;
  batchId: string;
  deviceId: string;
  customSupplyId: string;
  customSupplyName: string;
  digitalStock: number;
  devicePhysicalStock: number;
  justifiedWithdrawnStock: number;
  totalPhysicalStock: number;
  difference: number;
  alertLevel: string;
  status: string;
  resolutionAction: string | null;
  resolutionReason: string | null;
  resolutionJustification: string | null;
  resolvedByUserId: string | null;
  resolvedAt: string | null;
}

export type ConciliationTaskListResponse = ConciliationTaskResponse[];

/** Query params accepted by GET /api/v1/conciliation-tasks */
export interface ConciliationTaskQueryParams {
  accountId: string;
  status?: 'PENDING' | 'RESOLVED_MANUALLY' | 'RESOLVED_AUTOMATICALLY';
  customSupplyId?: string;
  branchId?: string;
  deviceId?: string;
}

/** Request body for POST /api/v1/conciliation-tasks/{id}/resolve */
export interface ResolveConciliationTaskRequest {
  resolvedByUserId: string;
  resolutionAction: string;
  resolutionReason: string;
  resolutionJustification: string;
  newJustifiedWithdrawnStock: number;
}
