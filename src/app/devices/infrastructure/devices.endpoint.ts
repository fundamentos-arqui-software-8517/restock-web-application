import { environment } from '../../../environments/environment';

const DEVICES_BASE = `${environment.platformProviderApiBaseUrl}/devices`;
const THRESHOLDS_BASE = `${environment.platformProviderApiBaseUrl}/device-thresholds`;

export const DEVICES_BY_ACCOUNT_URL = (accountId: string) =>
  `${DEVICES_BASE}?accountId=${accountId}`;
export const DEVICE_BY_ID_URL = (deviceId: string) =>
  `${DEVICES_BASE}/${deviceId}`;
export const CREATE_DEVICE_URL = () =>
  DEVICES_BASE;
export const ADD_SPECIFICATIONS_URL = (deviceId: string) =>
  `${DEVICES_BASE}/${deviceId}/specifications`;
export const ASSIGN_BRANCH_URL = (deviceId: string) =>
  `${DEVICES_BASE}/${deviceId}/configuration/branch`;
export const ASSIGN_BATCH_URL = (deviceId: string) =>
  `${DEVICES_BASE}/${deviceId}/configuration/batch`;
export const ASSIGN_THRESHOLD_URL = (deviceId: string) =>
  `${DEVICES_BASE}/${deviceId}/configuration/threshold`;
export const UPDATE_MEASUREMENT_URL = (deviceId: string) =>
  `${DEVICES_BASE}/${deviceId}/configuration/measurement`;
export const UPDATE_DEVICE_STATUS_URL = (deviceId: string) =>
  `${DEVICES_BASE}/${deviceId}/status`;
export const UPDATE_WITHDRAWN_STOCK_URL = (deviceId: string) =>
  `${DEVICES_BASE}/${deviceId}/withdrawn-stock`;

export const THRESHOLDS_BY_ACCOUNT_URL = (accountId: string) =>
  `${THRESHOLDS_BASE}?accountId=${accountId}`;
export const CREATE_THRESHOLD_URL = () =>
  THRESHOLDS_BASE;
export const THRESHOLD_BY_ID_URL = (thresholdId: string) =>
  `${THRESHOLDS_BASE}/${thresholdId}`;
