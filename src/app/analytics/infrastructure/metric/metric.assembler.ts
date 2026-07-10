import { Metric } from '../../domain/model/metric.entity';
import { MetricResponse } from './metric.response';

export class MetricAssembler {
  static toEntity(response: MetricResponse): Metric {
    return {
      id:              response.id,
      category:        response.category as Metric['category'],
      type:            response.type as Metric['type'],
      values:          response.values.map(v => ({
        value:      v.value,
        resourceId: v.resource_id,
      })),
      lastRefreshedAt: response.last_refreshed_at,
      dateRange: {
        startDate: response.date_range.start_date,
        endDate:   response.date_range.end_date,
      },
      accountId:       response.account_id,
    };
  }

  static toEntityList(responses: MetricResponse[]): Metric[] {
    return responses.map(r => MetricAssembler.toEntity(r));
  }
}