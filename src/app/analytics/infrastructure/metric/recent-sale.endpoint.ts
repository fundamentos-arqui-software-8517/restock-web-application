import { environment } from '../../../../environments/environment';

export class RecentSaleEndpoint {
  private static readonly baseUrl = environment.baseUrl;
  private static readonly path = environment.analyticsRecentSalesPath;

  static byAccountId(accountId: string): string {
    return `${RecentSaleEndpoint.baseUrl}${RecentSaleEndpoint.path.replace('{accountId}', accountId)}`;
  }
}
