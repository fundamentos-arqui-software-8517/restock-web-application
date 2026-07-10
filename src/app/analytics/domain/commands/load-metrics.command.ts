import { DateRange } from "../model/metric.entity";

export interface LoadMetricsCommand {
  accountId: string;
  dateRange: DateRange;
}