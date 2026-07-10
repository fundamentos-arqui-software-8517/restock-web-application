import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
} from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { CommunicationsStore, FilterType } from '../../../application/communications.store';
import { IamStore } from '../../../../iam/application/iam.store';
import { DeviceAlert, AlertType } from '../../../domain/model/notification.entity';
import { AlertCardComponent } from '../../components/alert-card/alert-card';
import { AlertDetailModalComponent } from '../../components/alert-detail-modal/alert-detail-modal';

@Component({
  selector: 'app-alerts-section',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, TranslatePipe, AlertCardComponent, AlertDetailModalComponent],
  templateUrl: './alerts-section.html',
  styleUrl:    './alerts-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertsSectionComponent {
  private readonly store    = inject(CommunicationsStore);
  private readonly iamStore = inject(IamStore);
  readonly alerts           = this.store.filteredAlerts;
  readonly isLoading        = this.store.isLoading;
  readonly error            = this.store.error;
  readonly selectedAlert    = this.store.selectedAlert;
  readonly activeFilter     = this.store.activeFilter;

  readonly totalAlerts              = this.store.totalAlerts;
  readonly totalConnectionLost      = this.store.totalConnectionLost;
  readonly totalInconsistentReading = this.store.totalInconsistentReading;
  readonly totalStockWarnings       = this.store.totalStockWarnings;
  readonly totalCritical            = this.store.totalCritical;
  readonly autoDismissedCount       = this.store.autoDismissedCount;

  readonly hasAlerts = computed(() => this.alerts().length > 0);

  constructor() {
    effect(() => {
      const user = this.iamStore.currentUser();
      if (user) {
        this.store.loadAlerts(user.id, user.accountId);
        this.store.evaluateStockThresholds(user.accountId, user.id);
      }
    });
  }

  onSearchInput(event: Event): void {
    this.store.setSearchQuery((event.target as HTMLInputElement).value);
  }

  onFilterChange(filter: FilterType): void {
    this.store.setFilter(filter);
  }

  openDetail(alert: DeviceAlert): void {
    this.store.openDetail(alert);
  }

  closeDetail(): void {
    this.store.closeDetail();
  }

  acknowledge(alertId: string): void {
    this.store.acknowledgeAlert(alertId);
  }

  resolve(alertId: string): void {
    this.store.resolveAlert(alertId);
  }

  reload(): void {
    const user = this.iamStore.currentUser();
    if (user) {
      this.store.loadAlerts(user.id, user.accountId);
      this.store.evaluateStockThresholds(user.accountId, user.id);
    }
  }

  openDataMismatchModal(): void {
    const testAlert: any = {
      id: 'alert-1',
      alertType: 'INCONSISTENT_READING',
      deviceDescription: 'Bin #R-44',
      message: 'Automated scan of Bin #R-44 detected 420 units, while ERP records show 455 units. Variance exceeds the 2% tolerance threshold.',
      severity: 'CRITICAL',
      status: 'ACTIVE',
      detectedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      metadata: {
        digitalReading: '12.5 KG',
        erpReading: '10.0 KG',
        gap: '-2.5 kg',
        supply: 'Olive Oil 500ml',
        detectionTime: '10 mins ago',
        calibration: 'SUSPECT',
        temperature: '4°C',
        humidity: '45%',
        lastHeartbeat: '2 hours ago 09:42 AM',
        scaleId: 'SCALE 09',
        scaleStatus: 'Online',
        serialNumber: 'TYM-2026-001'
      }
    };
    this.store.openDetail(testAlert);
  }

  openHardwareOfflineModal(): void {
    const testAlert: any = {
      id: 'alert-2',
      alertType: 'CONNECTION_LOST',
      deviceDescription: 'Scale Hub #09',
      message: 'Gateway G-12 has lost heartbeat with Scale Hub #09. Last recorded telemetry: 8,420kg. System is currently operating on historical estimation data.',
      severity: 'WARNING',
      status: 'ACTIVE',
      detectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      metadata: {
        deviceId: 'G-12 Analyzer: Device Microservices',
        lastTelemetry: '8,420 kg',
        lastHeartbeat: '2 hours ago 09:42 AM',
        lastKnownTemperature: '4°C',
        lastKnownHumidity: '45%',
        warning: 'Please verify physical power supply and local WiFi network stability for this device.'
      }
    };
    this.store.openDetail(testAlert);
  }

  openStockTransferModal(): void {
    const testAlert: any = {
      id: 'alert-3',
      alertType: 'MANUAL_TRANSFER',
      deviceDescription: 'Olive Oil Drums',
      message: 'An operator has finalized a manual stock withdrawal using the scale\'s physical button. An extraction of 3 units (approx. 15 kg) has been detected. Requires confirmation to update digital inventory.',
      severity: 'INFO',
      status: 'ACTIVE',
      detectedAt: new Date().toISOString(),
      metadata: {
        productName: 'Olive Oil',
        batchNumber: '#4492',
        withdrawnAmount: '3 Units',
        approxWeight: '15 kg',
        scaleWeight: 'DM -20.8kg',
        serialNumber: 'TYM-2026-001',
        warning: 'This amount has been physically removed from the scale. Confirm this action to deduct units from the current Batch and sync with the ERP.'
      }
    };
    this.store.openDetail(testAlert);
  }

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
    if (type === 'CONNECTION_LOST')     return 'alert-type--offline';
    if (type === 'INCONSISTENT_READING') return 'alert-type--mismatch';
    if (type === 'MANUAL_TRANSFER')     return 'alert-type--transfer';
    if (type === 'STOCK_WARNING')       return 'alert-type--stock';
    return '';
  }

  severityCls(severity: string): string {
    const map: Record<string, string> = {
      CRITICAL: 'severity--critical',
      WARNING:  'severity--warning',
      INFO:     'severity--info',
    };
    return map[severity] ?? '';
  }

  statusCls(status: string): string {
    const map: Record<string, string> = {
      ACTIVE:       'status--active',
      ACKNOWLEDGED: 'status--acknowledged',
      RESOLVED:     'status--resolved',
    };
    return map[status] ?? '';
  }


  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
}
