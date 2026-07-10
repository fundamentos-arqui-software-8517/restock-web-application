import { environment } from '../../../../environments/environment';

export class StockDiscrepancyEndpoint {
  private static readonly baseUrl = environment.baseUrl;
  private static readonly path = environment.analyticsStockDiscrepanciesPath;

  static bySupplyId(supplyId: string): string {
    return `${StockDiscrepancyEndpoint.baseUrl}${StockDiscrepancyEndpoint.path.replace('{id}', supplyId)}`;
  }
}
