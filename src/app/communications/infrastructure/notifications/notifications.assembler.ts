import {
  AlertSeverity,
  AlertSourceType,
  AlertStatus,
  DeviceAlert,
} from '../../domain/model/notification.entity';
import { NotificationResource } from './notifications.response';

export class NotificationsAssembler {
  static inferAlertType(resource: NotificationResource): string {
    const sourceType = resource.sourceType?.toUpperCase() ?? '';
    const title = resource.title?.toLowerCase() ?? '';

    switch (sourceType) {
      case 'MANUAL':
      case 'TRANSFER':
      case 'INVENTORY':
        return 'MANUAL_TRANSFER';
      case 'DISCREPANCY':
        return 'INCONSISTENT_READING';
      case 'DEVICE': {
        if (title.includes('salud') || title.includes('health') || title.includes('voltage') || title.includes('tensión') || title.includes('cpu') || title.includes('temperatura')) {
          return 'CONNECTION_LOST';
        }
        if (title.includes('new device') || title.includes('registro') || title.includes('registered')) {
          return 'DEVICE_REGISTERED';
        }
        return 'CONNECTION_LOST';
      }
      default:
        return 'STOCK_WARNING';
    }
  }

  static mapStatus(status: string): string {
    if (status === 'UNREAD')       return 'ACTIVE';
    if (status === 'READ')         return 'ACKNOWLEDGED';
    if (status === 'ACKNOWLEDGED') return 'ACKNOWLEDGED';
    if (status === 'RESOLVED')     return 'RESOLVED';
    return 'ACTIVE';
  }

  static toEntity(resource: NotificationResource): DeviceAlert {
    console.log('[NotificationsAssembler] mapping notification:', resource.id, resource.title, resource.sourceType);
    return DeviceAlert.create({
      id:           resource.id,
      title:        resource.title,
      message:      resource.message,
      severity:     resource.severity,
      status:       NotificationsAssembler.mapStatus(resource.status),
      sourceType:   resource.sourceType,
      alertType:    NotificationsAssembler.inferAlertType(resource),
      timestamp:    resource.timestamp,
    });
  }

  static toEntityList(resources: NotificationResource[]): DeviceAlert[] {
    return resources.map(r => NotificationsAssembler.toEntity(r));
  }
}
