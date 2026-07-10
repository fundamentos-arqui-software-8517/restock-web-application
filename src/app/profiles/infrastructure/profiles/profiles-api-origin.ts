import { environment } from '../../../../environments/environment';

export function profilesApiOrigin(): string {
  return environment.baseUrl;
}

export function profilesApiFallbackOrigin(): string {
  return environment.baseUrl;
}
