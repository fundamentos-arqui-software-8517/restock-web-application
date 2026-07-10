export type MetricCategory = 'INVENTORY' | 'WORKERS' | 'NOTIFICATIONS' | 'SALES';

export type MetricType =
  | 'SUPPLIES_CREATED' | 'LOW_STOCK_SUPPLIES' | 'ZERO_STOCK_SUPPLIES'
  | 'DEVICES_ACTIVE'
  | 'WORKERS_HIRED' | 'WORKERS_FIRED'
  | 'NOTIFICATIONS_RECEIVED'
  | 'SALES_MADE' | 'RECIPES_PROFIT' | 'KITS_PROFIT';

export interface Incrementable {
  value: number;
  resourceId: string;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface Metric {
  id: string;
  category: MetricCategory;
  type: MetricType;
  values: Incrementable[];
  lastRefreshedAt: string;
  dateRange: DateRange;
  accountId: string;
}
