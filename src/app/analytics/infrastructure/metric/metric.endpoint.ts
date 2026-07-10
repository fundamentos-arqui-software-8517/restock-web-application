import { environment } from '../../../../environments/environment';

export class MetricEndpoint {
  private static readonly baseUrl = environment.baseUrl;
  private static readonly path = environment.platformProviderAnalyticsEndpointPath;

  static get metrics(): string {
    return `${MetricEndpoint.baseUrl}/${MetricEndpoint.path}`;
  }

  static byAccount(accountId: string): string {
    return `${MetricEndpoint.baseUrl}/${MetricEndpoint.path}/account/${accountId}`;
  }

  static byId(id: string): string {
    return `${MetricEndpoint.baseUrl}/${MetricEndpoint.path}/${id}`;
  }
}
