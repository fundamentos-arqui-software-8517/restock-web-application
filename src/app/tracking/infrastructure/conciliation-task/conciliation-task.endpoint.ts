import { environment } from '../../../../environments/environment';

const BASE = `${environment.baseUrl}/${environment.platformProviderConciliationTasksEndpointPath}`;

export const CONCILIATION_TASKS_URL = BASE;
export const CONCILIATION_TASK_BY_ID_URL = (conciliationTaskId: string) =>
  `${BASE}/${encodeURIComponent(conciliationTaskId)}`;
export const RESOLVE_CONCILIATION_TASK_URL = (conciliationTaskId: string) =>
  `${BASE}/${encodeURIComponent(conciliationTaskId)}/resolve`;
