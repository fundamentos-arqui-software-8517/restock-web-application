import { environment } from '../../../../environments/environment';

const BASE = environment.baseUrl;

/**
 * Centralized URL factory for the notifications API.
 */
export class NotificationsApiEndpoint {
  static byRecipientUserId(recipientUserId: string): string {
    const path = environment.notificationsByRecipientUserIdPath.replace('{recipientUserId}', recipientUserId);
    return `${BASE}/${path}`;
  }

  static byId(notificationId: string): string {
    const path = environment.notificationsByIdPath.replace('{notificationId}', notificationId);
    return `${BASE}/${path}`;
  }
}
