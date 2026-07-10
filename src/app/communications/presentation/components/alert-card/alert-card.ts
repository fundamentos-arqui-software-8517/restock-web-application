import { Component, input, output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { DeviceAlert } from '../../../domain/model/notification.entity';

@Component({
  selector: 'app-alert-card',
  standalone: true,
  imports: [CommonModule, DatePipe, TranslatePipe],
  templateUrl: './alert-card.html',
  styleUrl: './alert-card.css',
})
export class AlertCardComponent {
  alert = input.required<DeviceAlert>();

  /** Emits the alert to open the detail modal */
  viewDetail = output<DeviceAlert>();
  /** Emits the alert ID to mark as acknowledged */
  acknowledge = output<string>();
  /** Emits the alert ID to mark as resolved */
  resolve = output<string>();

  alertTypeKey(type: string): string {
    const map: Record<string, string> = {
      'CONNECTION_LOST': 'hardwareOffline',
      'DEVICE_REGISTERED': 'deviceRegistration',
      'INCONSISTENT_READING': 'dataMismatch',
      'MANUAL_TRANSFER': 'manualTransfer',
      'STOCK_WARNING': 'stockWarning',
    };
    return 'communications.alertType.' + (map[type] ?? 'stockWarning');
  }

  alertTypeCls(type: string): string {
    if (type === 'CONNECTION_LOST')      return 'alert-type--offline';
    if (type === 'INCONSISTENT_READING') return 'alert-type--mismatch';
    if (type === 'MANUAL_TRANSFER')      return 'alert-type--transfer';
    if (type === 'STOCK_WARNING')        return 'alert-type--stock';
    return '';
  }

  timeAgo(dateStr: string): string {
    if (!dateStr) return 'Just now';
    const diffMs = Date.now() - new Date(dateStr).getTime();
    if (isNaN(diffMs) || diffMs < 0) return 'Just now';
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1)  return 'Just now';
    if (mins < 60) return mins === 1 ? '1 minute ago' : `${mins} minutes ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)  return hrs === 1  ? '1 hour ago'   : `${hrs} hours ago`;
    const days = Math.floor(hrs / 24);
    return days === 1 ? '1 day ago' : `${days} days ago`;
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
}
