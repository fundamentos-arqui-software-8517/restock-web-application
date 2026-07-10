import { BaseResource } from '../../../shared/infrastructure/base-response';

export interface NotificationResource extends BaseResource {
  id: string;
  title: string;
  message: string;
  severity: string;
  status: string;
  sourceType: string;
  timestamp: string;
}

export interface NotificationListResponse {
  notifications: NotificationResource[];
  total: number;
}
