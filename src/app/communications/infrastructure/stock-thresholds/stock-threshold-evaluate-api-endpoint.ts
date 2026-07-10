import { environment } from '../../../../environments/environment';

const BASE = environment.baseUrl;

export class StockThresholdEvaluateApiEndpoint {
  static evaluate(accountId: string): string {
    const params = new URLSearchParams({ accountId });
    return `${BASE}/${environment.stockThresholdsEvaluatePath}?${params}`;
  }
}
