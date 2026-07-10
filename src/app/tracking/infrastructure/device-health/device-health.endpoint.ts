import { environment } from '../../../../environments/environment';

const BASE = `${environment.baseUrl}/device-health-checks`;

export const DEVICE_HEALTH_ENDPOINT = BASE;
export const DEVICE_HEALTH_BY_DEVICE_URL = (deviceId: string) => `${BASE}?deviceId=${encodeURIComponent(deviceId)}`;
export const RECALIBRATE_DEVICE_URL = (deviceId: string) => `${BASE}/${encodeURIComponent(deviceId)}/recalibrate`;
