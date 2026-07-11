import { environment } from '../../../../environments/environment';

const BASE = `${environment.baseUrl}/devices-health`;

export const DEVICE_HEALTH_ENDPOINT = BASE;
export const DEVICE_HEALTH_BY_DEVICE_URL = (deviceId: string) => `${BASE}?deviceId=${encodeURIComponent(deviceId)}`;
