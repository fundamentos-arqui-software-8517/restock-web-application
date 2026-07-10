import { Component, computed, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { DeviceAlert } from '../../../domain/model/notification.entity';
import { ResourceStore } from '../../../../resource/application/resource.store';

@Component({
  selector: 'app-alert-detail-modal',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './alert-detail-modal.html',
  styleUrl: './alert-detail-modal.css',
})
export class AlertDetailModalComponent {
  private readonly resourceStore = inject(ResourceStore);

  alert = input.required<DeviceAlert>();

  close = output<void>();
  acknowledge = output<string>();
  resolve = output<string>();

  readonly supplyImgUrl = computed(() => {
    const a = this.alert();
    const searchTerm = (a.deviceDescription || a.title || '').toLowerCase();
    if (!searchTerm) return null;

    const supply = this.resourceStore.customSupplies().find(s => {
      const sn = s.name.toLowerCase();
      return sn === searchTerm || searchTerm.includes(sn) || sn.includes(searchTerm);
    });

    return supply?.imgUrl || null;
  });

  alertTypeCls(type: string): string {
    if (type === 'CONNECTION_LOST') return 'alert-type--offline';
    if (type === 'INCONSISTENT_READING') return 'alert-type--mismatch';
    if (type === 'MANUAL_TRANSFER') return 'alert-type--transfer';
    if (type === 'STOCK_WARNING') return 'alert-type--stock';
    return '';
  }

  timeAgo(dateStr: string): string {
    if (!dateStr) return 'Just now';
    const now = new Date();
    const past = new Date(dateStr);
    const diffMs = now.getTime() - past.getTime();
    if (isNaN(diffMs) || diffMs < 0) return 'Just now';

    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) {
      return diffMins === 1 ? '1 minute ago' : `${diffMins} minutes ago`;
    }

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    }

    const diffDays = Math.floor(diffHours / 24);
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
  }

  viewDetail(): void {
    // Navigate to detail view
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
}
