import { environment } from '../../../../environments/environment';

const BASE = `${environment.baseUrl}/${environment.platformProviderBranchesEndpointPath}`;

export const BRANCHES_URL = BASE;
export const BRANCHES_BY_ACCOUNT_URL = (accountId: string) =>
  `${BASE}?accountId=${encodeURIComponent(accountId)}`;
export const BRANCH_BY_ID_URL = (branchId: string) =>
  `${BASE}/${encodeURIComponent(branchId)}`;
export const BRANCH_STATUS_URL = (branchId: string) =>
  `${BASE}/${encodeURIComponent(branchId)}/status`;
