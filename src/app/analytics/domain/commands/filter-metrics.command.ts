import { DateRange, MetricCategory } from "../model/metric.entity";

export interface FilterMetricsCommand {
  accountId: string;
  category?: MetricCategory;
  dateRange?: DateRange;
}