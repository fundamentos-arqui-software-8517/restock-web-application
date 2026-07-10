export interface IncrementableResponse {
  value: number;
  resource_id: string;
}

export interface MetricResponse {
  id: string;
  category: string;
  type: string;
  values: IncrementableResponse[];
  last_refreshed_at: string;
  date_range: {
    start_date: string;
    end_date: string;
  };
  account_id: string;
}