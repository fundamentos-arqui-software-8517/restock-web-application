import { environment } from '../../../../environments/environment';

/**
 * Resolves the HTTP origin (no trailing slash) for profiles/businesses REST calls.
 *
 * @throws When the active `environment` does not define {@link environment.profilesApi.baseUrl}.
 */
export function profilesApiOrigin(): string {
    const base = environment.profilesApi?.baseUrl?.trim().replace(/\/+$/, '');
    if (!base) {
    throw new Error(
            '[profiles] environment.profilesApi.baseUrl must be a non-empty string for this build target.',
    );
  }
  return base;
}

/**
 * Resolves the fallback HTTP origin used when the primary origin returns a non-2xx response.
 *
 * @throws When the active `environment` does not define {@link environment.profilesApi.fallbackBaseUrl}.
 */
export function profilesApiFallbackOrigin(): string {
  const base = environment.profilesApi?.fallbackBaseUrl?.trim().replace(/\/+$/, '');
  if (!base) {
    throw new Error(
      '[profiles] environment.profilesApi.fallbackBaseUrl must be a non-empty string for this build target.',
    );
  }
  return base;
}

