import { environment } from '../../../../environments/environment';

const BASE = `${environment.baseUrl}/telemetry-readings`;

export const TELEMETRY_ENDPOINT = BASE;
export const TELEMETRY_BY_DEVICE_URL = (deviceId: string) => `${BASE}?deviceId=${encodeURIComponent(deviceId)}`;
