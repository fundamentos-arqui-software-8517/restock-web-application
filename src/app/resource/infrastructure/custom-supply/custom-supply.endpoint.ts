import { environment } from '../../../../environments/environment';

const BASE = `${environment.platformProviderApiBaseUrl}/${environment.platformProviderCustomSuppliesEndpointPath}`;

export const CUSTOM_SUPPLIES_BY_ACCOUNT_URL = (accountId: string) => `${BASE}?accountId=${accountId}`;
export const CREATE_CUSTOM_SUPPLY_URL = (accountId: string) => `${BASE}?accountId=${accountId}`;
export const CUSTOM_SUPPLY_BY_ID_URL = (customSupplyId: string) => `${BASE}/${customSupplyId}`;
export const UPDATE_CUSTOM_SUPPLY_URL = (customSupplyId: string) => `${BASE}/${customSupplyId}`;
export const DELETE_CUSTOM_SUPPLY_URL = (customSupplyId: string) => `${BASE}/${customSupplyId}`;
