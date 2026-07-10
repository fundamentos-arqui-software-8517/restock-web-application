import { BaseEntity } from '../../../shared/domain/model/base-entity';

/** Discriminated union of all alert categories the system can raise. */
export type AlertType =
  | 'CONNECTION_LOST'
  | 'INCONSISTENT_READING'
  | 'MANUAL_TRANSFER'
  | 'DEVICE_REGISTERED'
  | 'STOCK_WARNING';

/** Identifies the origin domain that generated the notification. */
export type AlertSourceType =
  | 'DEVICE'
  | 'INVENTORY'
  | 'SYSTEM';

export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';

/**
 * Represents an integrity alert generated when a device
 * either loses connectivity or transmits anomalous readings,
 * or a stock-related notification from the system.
 *
 * Belongs to the Communications bounded context (US-28).
 */
export class DeviceAlert implements BaseEntity {
  private constructor(
    public readonly id: string,
    public readonly deviceId: string,
    public readonly deviceDescription: string,
    public readonly branchId: string | null,
    public readonly branchName: string | null,
    public readonly alertType: AlertType,
    public readonly severity: AlertSeverity,
    public readonly status: AlertStatus,
    public readonly detectedAt: string,
    /** Last known telemetry value (kg). Populated for both alert types. */
    public readonly lastTelemetryKg: number | null,
    /** Detected sensor reading (only set for INCONSISTENT_READING alerts). */
    public readonly detectedValue: number | null,
    /** Expected / threshold value (only set for INCONSISTENT_READING alerts). */
    public readonly thresholdValue: number | null,
    public readonly message: string,
    /** Origin domain of the notification (DEVICE | INVENTORY | SYSTEM). */
    public readonly sourceType: AlertSourceType | null,
    /**
     * ID of the source entity that triggered the alert.
     * For STOCK_WARNING alerts this is the customSupplyId.
     */
    public readonly sourceEntityId: string | null,
    /** Generic notification title. */
    public readonly title: string,
    /** ISO timestamp of the notification. */
    public readonly timestamp: string,
    /** Optional metadata for arbitrary attributes. */
    public readonly metadata: any | null = null,
  ) {}

  static create(props: {
    id: string;
    deviceId?: string;
    deviceDescription?: string;
    branchId?: string | null;
    branchName?: string | null;
    alertType?: string;
    severity: string;
    status: string;
    detectedAt?: string;
    lastTelemetryKg?: number | null;
    detectedValue?: number | null;
    thresholdValue?: number | null;
    message: string;
    sourceType?: string | null;
    sourceEntityId?: string | null;
    title?: string;
    timestamp?: string;
    metadata?: any;
  }): DeviceAlert {
    let actualType = (props.alertType as AlertType) ?? 'STOCK_WARNING';
    if (props.title?.toLowerCase().includes('device') && !props.alertType) {
      actualType = 'DEVICE_REGISTERED';
    }

    return new DeviceAlert(
      props.id,
      props.deviceId ?? '',
      props.deviceDescription ?? '',
      props.branchId ?? null,
      props.branchName ?? null,
      actualType,
      props.severity as AlertSeverity,
      props.status as AlertStatus,
      props.detectedAt ?? props.timestamp ?? new Date().toISOString(),
      props.lastTelemetryKg ?? null,
      props.detectedValue ?? null,
      props.thresholdValue ?? null,
      props.message,
      (props.sourceType as AlertSourceType) ?? null,
      props.sourceEntityId ?? null,
      props.title ?? '',
      props.timestamp ?? props.detectedAt ?? new Date().toISOString(),
      props.metadata ?? null,
    );
  }

  get isConnectionLost(): boolean {
    return this.alertType === 'CONNECTION_LOST';
  }

  get isDeviceRegistered(): boolean {
    return this.alertType === 'DEVICE_REGISTERED';
  }

  get isInconsistentReading(): boolean {
    return this.alertType === 'INCONSISTENT_READING';
  }

  get isManualTransfer(): boolean {
    return this.alertType === 'MANUAL_TRANSFER';
  }

  get isStockWarning(): boolean {
    return this.alertType === 'STOCK_WARNING';
  }

  get isInventoryAlert(): boolean {
    return this.sourceType === 'INVENTORY' || this.isStockWarning;
  }

  get isCritical(): boolean {
    return this.severity === 'CRITICAL';
  }

  get isActive(): boolean {
    return this.status === 'ACTIVE';
  }
}
