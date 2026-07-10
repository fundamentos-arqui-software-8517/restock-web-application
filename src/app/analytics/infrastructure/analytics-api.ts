import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Metric } from '../domain/model/metric.entity';
import { StockDiscrepancy } from '../domain/model/stock-discrepancy.entity';
import { RecentSale } from '../domain/model/recent-sale.entity';
import { CriticalProduct } from '../domain/model/critical-product.entity';
import { MetricResponse } from './metric/metric.response';
import { StockDiscrepancyResponse } from './metric/stock-discrepancy.response';
import { RecentSaleResponse } from './metric/recent-sale.response';
import { CriticalProductResponse } from './metric/critical-product.response';
import { MetricAssembler } from './metric/metric.assembler';
import { StockDiscrepancyAssembler } from './metric/stock-discrepancy.assembler';
import { RecentSaleAssembler } from './metric/recent-sale.assembler';
import { CriticalProductAssembler } from './metric/critical-product.assembler';
import { MetricEndpoint } from './metric/metric.endpoint';
import { StockDiscrepancyEndpoint } from './metric/stock-discrepancy.endpoint';
import { RecentSaleEndpoint } from './metric/recent-sale.endpoint';
import { CriticalProductEndpoint } from './metric/critical-product.endpoint';
import { LoadMetricsCommand } from '../domain/commands/load-metrics.command';
import { SupplyResponse } from './supply/supply.response';
import { SUPPLY_ENDPOINT } from './supply/supply.endpoint';

@Injectable({ providedIn: 'root' })
export class AnalyticsApi {
  private readonly http = inject(HttpClient);

  getMetrics(command: LoadMetricsCommand): Observable<Metric[]> {
    const params = new HttpParams()
      .set('start_date', command.dateRange.startDate)
      .set('end_date',   command.dateRange.endDate);

    return this.http
      .get<MetricResponse[]>(
        MetricEndpoint.byAccount(command.accountId),
        { params }
      )
      .pipe(map(MetricAssembler.toEntityList));
  }

  getMetricById(id: string): Observable<Metric> {
    return this.http
      .get<MetricResponse>(MetricEndpoint.byId(id))
      .pipe(map(MetricAssembler.toEntity));
  }

  getStockDiscrepancies(supplyId: string): Observable<StockDiscrepancy[]> {
    return this.http
      .get<StockDiscrepancyResponse[]>(StockDiscrepancyEndpoint.bySupplyId(supplyId))
      .pipe(map(StockDiscrepancyAssembler.toEntityList));
  }

  getRecentSales(
    accountId: string,
    startDate?: string,
    endDate?: string
  ): Observable<RecentSale[]> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate)   params = params.set('endDate', endDate);

    return this.http
      .get<RecentSaleResponse[]>(RecentSaleEndpoint.byAccountId(accountId), { params })
      .pipe(map(RecentSaleAssembler.toEntityList));
  }

  getCriticalProducts(accountId: string): Observable<CriticalProduct[]> {
    return this.http
      .get<CriticalProductResponse[]>(CriticalProductEndpoint.byAccountId(accountId))
      .pipe(map(CriticalProductAssembler.toEntityList));
  }

  getSupplies(): Observable<SupplyResponse[]> {
    return this.http.get<SupplyResponse[]>(SUPPLY_ENDPOINT);
  }
}
