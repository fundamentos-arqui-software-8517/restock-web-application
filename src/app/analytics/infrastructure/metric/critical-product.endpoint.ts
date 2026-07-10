import { environment } from '../../../../environments/environment';

export class CriticalProductEndpoint {
  private static readonly baseUrl = environment.baseUrl;
  private static readonly path = environment.analyticsCriticalProductsPath;

  static byAccountId(accountId: string): string {
    return `${CriticalProductEndpoint.baseUrl}${CriticalProductEndpoint.path.replace('{accountId}', accountId)}`;
  }
}
