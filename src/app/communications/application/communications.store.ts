import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { DeviceAlert, AlertType } from '../domain/model/notification.entity';
import { StockThresholdAlert } from '../domain/model/stock-threshold-alert.entity';
import { CommunicationsApi } from '../infrastructure/communications-api';
import { ResourceStore } from '../../resource/application/resource.store';

export type FilterType = 'ALL' | 'STOCK_WARNINGS' | 'CONNECTION_LOST' | 'INCONSISTENT_READING' | 'CRITICAL';

@Injectable({ providedIn: 'root' })
export class CommunicationsStore {
  private readonly api           = inject(CommunicationsApi);
  private readonly resourceStore = inject(ResourceStore);

  readonly alerts        = signal<DeviceAlert[]>([]);
  readonly isLoading     = signal<boolean>(false);
  readonly error         = signal<string | null>(null);
  readonly selectedAlert = signal<DeviceAlert | null>(null);
  readonly activeFilter  = signal<FilterType>('ALL');
  readonly searchQuery   = signal<string>('');

  /**
   * Tracks IDs of alerts that were automatically resolved during this session
   * due to stock normalization (stock > minimumStock).
   * Used to avoid re-showing dismissed alerts on next load.
   */
  private readonly autoDismissedIds = signal<Set<string>>(new Set());

  readonly connectionLostAlerts = computed(() =>
    this.alerts().filter(a => a.alertType === 'CONNECTION_LOST' || a.alertType === 'DEVICE_REGISTERED'),
  );

  readonly inconsistentReadingAlerts = computed(() =>
    this.alerts().filter(a => a.alertType === 'INCONSISTENT_READING'),
  );

  readonly manualTransferAlerts = computed(() =>
    this.alerts().filter(a => a.alertType === 'MANUAL_TRANSFER'),
  );

  /** Alerts that originated from the inventory/stock subsystem. */
  readonly stockWarningAlerts = computed(() =>
    this.alerts().filter(a => a.isInventoryAlert),
  );

  readonly criticalAlerts = computed(() =>
    this.alerts().filter(a => a.isCritical),
  );

  readonly activeAlerts = computed(() =>
    this.alerts().filter(a => a.isActive),
  );

  readonly filteredAlerts = computed(() => {
    const filter = this.activeFilter();
    const query  = this.searchQuery().toLowerCase().trim();

    // Only show active alerts (not acknowledged or resolved)
    let list = this.alerts().filter(a => a.isActive);

    switch (filter) {
      case 'CONNECTION_LOST':
        list = list.filter(a => a.alertType === 'CONNECTION_LOST' || a.alertType === 'DEVICE_REGISTERED');
        break;
      case 'INCONSISTENT_READING':
        list = list.filter(a => a.alertType === 'INCONSISTENT_READING');
        break;
      case 'STOCK_WARNINGS':
        list = list.filter(a => a.isInventoryAlert);
        break;
      case 'CRITICAL':
        list = list.filter(a => a.isCritical);
        break;
      default:
        break;
    }

    if (query) {
      list = list.filter(a =>
        a.deviceDescription.toLowerCase().includes(query) ||
        a.message.toLowerCase().includes(query) ||
        (a.branchName?.toLowerCase().includes(query) ?? false),
      );
    }

    return [...list].sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime());
  });

  readonly totalAlerts              = computed(() => this.alerts().length);
  readonly totalConnectionLost      = computed(() => this.connectionLostAlerts().length);
  readonly totalInconsistentReading = computed(() => this.inconsistentReadingAlerts().length);
  readonly totalStockWarnings       = computed(() => this.stockWarningAlerts().length);
  readonly totalCritical            = computed(() => this.criticalAlerts().length);

  /**
   * Number of alerts that were silently auto-resolved in this session
   * because the corresponding stock returned to normal levels.
   */
  readonly autoDismissedCount = computed(() => this.autoDismissedIds().size);

  /** Results from the latest stock threshold evaluation. */
  readonly stockThresholdResults = signal<StockThresholdAlert[]>([]);
  readonly isEvaluating          = signal<boolean>(false);
  readonly evaluationError       = signal<string | null>(null);

  constructor() {
    effect(() => {
      const rows = this.resourceStore.rows();
      if (!rows.length) return;

      const inventoryAlerts = this.alerts().filter(a => a.isInventoryAlert && a.isActive);
      if (!inventoryAlerts.length) return;

      /** Aggregate stock per customSupplyId across all branches. */
      const stockBySupplyId = new Map<string, { stock: number; minStock: number }>();
      for (const row of rows) {
        const existing = stockBySupplyId.get(row.customSupplyId);
        if (existing) {
          existing.stock += row.stock;
        } else {
          stockBySupplyId.set(row.customSupplyId, { stock: row.stock, minStock: row.minStock });
        }
      }

      const normalizedIds = new Set<string>();

      for (const alert of inventoryAlerts) {
        let isNormalized = false;

        if (alert.sourceEntityId) {
          const entry = stockBySupplyId.get(alert.sourceEntityId);
          isNormalized = !!entry && entry.stock >= entry.minStock;
        } else if (alert.deviceDescription) {
          // Only fuzzy-match when description is non-empty to avoid ''.includes('') = true
          for (const [, entry] of stockBySupplyId) {
            const row = rows.find(r => r.customSupplyId === [...stockBySupplyId.entries()].find(([, v]) => v === entry)?.[0]);
            if (row && row.supplyName && alert.deviceDescription.toLowerCase().includes(row.supplyName.toLowerCase())) {
              isNormalized = entry.stock >= entry.minStock;
              break;
            }
          }
        }

        if (isNormalized) {
          normalizedIds.add(alert.id);
        }
      }

      if (normalizedIds.size === 0) return;

      this.alerts.update(list =>
        list.map(a =>
          normalizedIds.has(a.id)
            ? DeviceAlert.create({ ...a, status: 'RESOLVED' })
            : a,
        ),
      );

      this.autoDismissedIds.update(ids => {
        const next = new Set(ids);
        normalizedIds.forEach(id => next.add(id));
        return next;
      });

      const selected = this.selectedAlert();
      if (selected && normalizedIds.has(selected.id)) {
        this.closeDetail();
      }
    });
  }

  loadAlerts(userId: string, accountId: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    let loaded = 0;
    const markDone = () => {
      loaded++;
      if (loaded === 2) this.isLoading.set(false);
    };

    this.api.getAlertsByRecipientUserId(userId).subscribe({
      next: alerts => {
        const dismissed = this.autoDismissedIds();
        this.alerts.update(list => this.mergeAlerts(list, alerts.filter(a => !dismissed.has(a.id))));
      },
      complete: markDone,
      error: markDone,
    });

    this.api.getAlertsByRecipientUserId(accountId).subscribe({
      next: alerts => {
        const dismissed = this.autoDismissedIds();
        this.alerts.update(list => this.mergeAlerts(list, alerts.filter(a => !dismissed.has(a.id))));
      },
      complete: markDone,
      error: markDone,
    });
  }

  evaluateStockThresholds(accountId: string, userId: string): void {
    this.isEvaluating.set(true);
    this.evaluationError.set(null);

    this.api.evaluateStockThresholds(accountId).subscribe({
      next: results => {
        this.stockThresholdResults.set(results);
        const thresholdAlerts = results.map(r => this.toDeviceAlert(r));
        this.alerts.update(list => this.mergeAlerts(list, thresholdAlerts));

        // Load persisted notifications with both IDs
        this.loadNotifications(userId, accountId);
      },
      error: (err) => {
        this.evaluationError.set(err?.message || 'Failed to evaluate stock thresholds');
        this.stockThresholdResults.set([]);
        this.isEvaluating.set(false);
      },
    });
  }

  private loadNotifications(userId: string, accountId: string): void {
    let loaded = 0;
    const markDone = () => {
      loaded++;
      if (loaded === 2) this.isEvaluating.set(false);
    };

    this.api.getAlertsByRecipientUserId(userId).subscribe({
      next: alerts => {
        const dismissed = this.autoDismissedIds();
        this.alerts.update(list => this.mergeAlerts(list, alerts.filter(a => !dismissed.has(a.id))));
      },
      complete: markDone,
      error: markDone,
    });

    this.api.getAlertsByRecipientUserId(accountId).subscribe({
      next: alerts => {
        const dismissed = this.autoDismissedIds();
        this.alerts.update(list => this.mergeAlerts(list, alerts.filter(a => !dismissed.has(a.id))));
      },
      complete: markDone,
      error: markDone,
    });
  }

  private toDeviceAlert(result: StockThresholdAlert): DeviceAlert {
    const isExcess = result.isExcess;
    const isUnder  = result.isUnderStock;
    return DeviceAlert.create({
      id:               result.alertId || `${result.customSupplyId}-eval`,
      title:            isExcess ? 'Excess Stock Alert' : isUnder ? 'Low Stock Alert' : 'Stock Evaluation',
      message:          isExcess
        ? `${result.customSupplyName}: ${result.currentStock} / ${result.maxStock} kg - EXCESS STOCK`
        : isUnder
        ? `${result.customSupplyName}: ${result.currentStock} / ${result.maxStock} kg - LOW STOCK`
        : `${result.customSupplyName}: ${result.currentStock} / ${result.maxStock} kg - Normal`,
      severity:         isExcess ? 'WARNING' : 'INFO',
      status:           'ACTIVE',
      sourceType:       'INVENTORY',
      sourceEntityId:   result.customSupplyId,
      detectedAt:       new Date().toISOString(),
      deviceDescription: result.customSupplyName,
      alertType:        'STOCK_WARNING',
      timestamp:        new Date().toISOString(),
    });
  }

  private mergeAlerts(existing: DeviceAlert[], incoming: DeviceAlert[]): DeviceAlert[] {
    const ids = new Set(existing.map(a => a.id));
    return [...existing, ...incoming.filter(a => !ids.has(a.id))];
  }

  openDetail(alert: DeviceAlert): void {
    this.selectedAlert.set(alert);
  }

  closeDetail(): void {
    this.selectedAlert.set(null);
  }

  setFilter(filter: FilterType): void {
    this.activeFilter.set(filter);
  }

  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  acknowledgeAlert(alertId: string): void {
    this.alerts.update(list =>
      list.map(a =>
        a.id === alertId
          ? DeviceAlert.create({ ...a, status: 'ACKNOWLEDGED' })
          : a,
      ),
    );
    this.closeDetail();
  }

  resolveAlert(alertId: string): void {
    this.alerts.update(list =>
      list.map(a =>
        a.id === alertId
          ? DeviceAlert.create({ ...a, status: 'RESOLVED' })
          : a,
      ),
    );
    this.closeDetail();
  }
}
