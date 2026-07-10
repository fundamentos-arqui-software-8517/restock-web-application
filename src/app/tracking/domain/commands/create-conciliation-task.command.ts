export interface CreateConciliationTaskCommand {
  discrepancyId: string;
  cause: string;
  justification: string;
  resolvedAt: string;
}
