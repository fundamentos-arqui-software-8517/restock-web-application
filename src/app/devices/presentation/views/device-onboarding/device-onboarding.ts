import { Component, effect, inject, OnInit, OnDestroy, signal, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, of, switchMap } from 'rxjs';

import { DevicesStore } from '../../../application/devices.store';
import { DeviceThresholdsStore } from '../../../application/device-thresholds.store';
import { IamStore } from '../../../../iam/application/iam.store';
import { ResourceStore } from '../../../../resource/application/resource.store';
import { Device } from '../../../domain/model/device.entity';
import { DeviceStatus } from '../../../domain/model/device-status';
import { TrackingApi } from '../../../../tracking/infrastructure/tracking-api';
import { DevicesApi } from '../../../infrastructure/devices-api';

@Component({
  selector: 'app-device-onboarding',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  templateUrl: './device-onboarding.html',
  styleUrls: ['./device-onboarding.css'],
})
export class DeviceOnboarding implements OnInit, OnDestroy {
  private readonly devicesStore = inject(DevicesStore);
  private readonly thresholdsStore = inject(DeviceThresholdsStore);
  private readonly iamStore = inject(IamStore);
  readonly resourceStore = inject(ResourceStore);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly trackingApi = inject(TrackingApi);
  private readonly devicesApi = inject(DevicesApi);
  private readonly translateService = inject(TranslateService);

  readonly currentDevice = signal<Device | null>(null);
  readonly loading = signal(false);
  readonly pageError = signal<string | null>(null);
  readonly showAssignBatchDialog = signal(false);
  readonly showUnlinkDialog = signal(false);
  unlinkConfirmText = '';

  readonly historyTab = signal<'weight' | 'health'>('weight');
  readonly telemetryReadings = signal<any[]>([]);
  readonly healthLogs = signal<any[]>([]);
  private pollingIntervalId: any = null;
  readonly weightUnits = [
    { name: 'gram', abbr: 'g' },
    { name: 'kilogram', abbr: 'kg' },
    { name: 'pound', abbr: 'lb' },
  ];

  readonly assignBatchForm: FormGroup = this.fb.group({
    batchId: ['', Validators.required],
  });

  readonly calibrationForm: FormGroup = this.fb.group({
    unitStockWeight: [null, [Validators.required, Validators.min(0)]],
    tareWeight: [0, [Validators.required, Validators.min(0)]],
    weightUnitName: ['gram', Validators.required],
    weightUnitAbbreviation: ['g', Validators.required],
  });

  readonly displayModeOptions: { value: string; labelKey: string }[] = [
    {
      value: 'DISPLAY_MODE_ENVIRONMENT',
      labelKey: 'devices.onboarding.displayMode.options.environment',
    },
    {
      value: 'DISPLAY_MODE_TEMPERATURE',
      labelKey: 'devices.onboarding.displayMode.options.temperature',
    },
    { value: 'DISPLAY_MODE_HUMIDITY', labelKey: 'devices.onboarding.displayMode.options.humidity' },
    { value: 'DISPLAY_MODE_WEIGHT', labelKey: 'devices.onboarding.displayMode.options.weight' },
    {
      value: 'DISPLAY_MODE_CONVERTED_UNITS',
      labelKey: 'devices.onboarding.displayMode.options.convertedUnits',
    },
  ];

  readonly displayModeForm: FormGroup = this.fb.group({
    displayMode: ['DISPLAY_MODE_ENVIRONMENT', Validators.required],
  });

  readonly specificationsForm: FormGroup = this.fb.group({
    manufacturer: ['', Validators.required],
    model: ['', Validators.required],
    firmwareVersion: ['', Validators.required],
  });

  readonly branchForm: FormGroup = this.fb.group({
    branchId: ['', Validators.required],
  });

  readonly thresholdsForm: FormGroup = this.fb.group({
    minStock: [null, [Validators.required, Validators.min(0)]],
    maxStock: [null, [Validators.required, Validators.min(0)]],
    anomalyThreshold: [15, [Validators.min(0)]],
    minTemperature: [null],
    maxTemperature: [null],
    minHumidity: [null, [Validators.min(0), Validators.max(100)]],
    maxHumidity: [null, [Validators.min(0), Validators.max(100)]],
  });

  constructor() {
    effect(() => {
      const accountId = this.iamStore.currentUser()?.accountId ?? '';
      if (accountId) {
        untracked(() => {
          this.resourceStore.loadInventoryContext(accountId);
          this.thresholdsStore.loadThresholdsForAccount(accountId);
        });
      }
    });

    effect(() => {
      this.prefillThresholds();
    });

    effect(() => {
      this.prefillCalibration();
    });
  }

  ngOnInit(): void {
    const s = history.state?.device;
    if (s) {
      const device = new Device({
        id: s._id ?? s.id,
        accountId: s._accountId ?? s.accountId,
        macAddress: s._macAddress ?? s.macAddress,
        description: s._description ?? s.description,
        status: s._status ?? s.status,
        manufacturer: s._manufacturer ?? s.manufacturer ?? null,
        model: s._model ?? s.model ?? null,
        firmwareVersion: s._firmwareVersion ?? s.firmwareVersion ?? null,
        branchId: s._branchId ?? s.branchId ?? null,
        assignedBatchId: s._assignedBatchId ?? s.assignedBatchId ?? null,
        supplyThresholdId: s._supplyThresholdId ?? s.supplyThresholdId ?? null,
        unitStockWeight: s._unitStockWeight ?? s.unitStockWeight ?? s.netWeight ?? null,
        tareWeight: s._tareWeight ?? s.tareWeight ?? null,
        grossWeight: s._grossWeight ?? s.grossWeight ?? null,
        calibrationDate: s._calibrationDate ?? s.calibrationDate ?? null,
        weightUnitName: s._weightUnitName ?? s.weightUnitName ?? null,
        weightUnitAbbreviation: s._weightUnitAbbreviation ?? s.weightUnitAbbreviation ?? null,
        justifiedWithdrawnStock: s._justifiedWithdrawnStock ?? s.justifiedWithdrawnStock ?? 0,
        displayMode: s._displayMode ?? s.displayMode ?? null,
      });
      this.currentDevice.set(device);
      this.specificationsForm.patchValue({
        manufacturer: device.manufacturer ?? '',
        model: device.model ?? '',
        firmwareVersion: device.firmwareVersion ?? '',
      });
      this.branchForm.patchValue({ branchId: device.branchId ?? '' });
      this.assignBatchForm.patchValue({ batchId: device.assignedBatchId ?? '' });
      this.calibrationForm.patchValue({
        unitStockWeight: device.unitStockWeight,
        tareWeight: device.tareWeight ?? 0,
        weightUnitName: device.weightUnitName ?? 'gram',
        weightUnitAbbreviation: device.weightUnitAbbreviation ?? 'g',
      });
      this.displayModeForm.patchValue({
        displayMode: device.displayMode ?? 'DISPLAY_MODE_ENVIRONMENT',
      });
    } else {
      this.router.navigate(['/devices']);
    }
    this.startLogsPolling();
  }

  ngOnDestroy(): void {
    this.stopLogsPolling();
  }

  setHistoryTab(tab: 'weight' | 'health'): void {
    this.historyTab.set(tab);
  }

  private startLogsPolling(): void {
    const device = this.currentDevice();
    if (!device) return;

    this.fetchLogs(device.macAddress);

    this.pollingIntervalId = setInterval(() => {
      this.fetchLogs(device.macAddress);
    }, 5000);
  }

  private stopLogsPolling(): void {
    if (this.pollingIntervalId) {
      clearInterval(this.pollingIntervalId);
      this.pollingIntervalId = null;
    }
  }

  private fetchLogs(deviceId: string): void {
    this.trackingApi.getTelemetryReadings(deviceId).subscribe({
      next: (readings) => {
        const sorted = readings.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        );
        this.telemetryReadings.set(sorted.slice(0, 15)); // Keep latest 15 readings
      },
      error: (err: any) => console.error('Failed to fetch telemetry readings', err),
    });

    this.devicesApi.getDeviceHealthLogs(deviceId).subscribe({
      next: (logs: any) => {
        const sorted = logs.sort(
          (a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        );
        this.healthLogs.set(sorted.slice(0, 15)); // Keep latest 15 health logs
      },
      error: (err: any) => console.error('Failed to fetch health logs', err),
    });
  }

  private get accountId(): string {
    return this.iamStore.currentUser()?.accountId ?? '';
  }

  statusLabel(status: DeviceStatus): string {
    const labels: Record<DeviceStatus, string> = {
      REGISTERED: 'devices.status.registered',
      CONFIGURED: 'devices.status.configured',
      CALIBRATED: 'devices.status.calibrated',
      ACTIVE: 'devices.status.active',
      INACTIVE: 'devices.status.inactive',
    };
    return labels[status];
  }

  statusClass(status: DeviceStatus): string {
    const classes: Record<DeviceStatus, string> = {
      REGISTERED: 'badge-pending',
      CONFIGURED: 'badge-configured',
      CALIBRATED: 'badge-active',
      ACTIVE: 'badge-active',
      INACTIVE: 'badge-inactive',
    };
    return classes[status];
  }

  hasSpecifications(device: Device): boolean {
    return !!device.manufacturer && !!device.model && !!device.firmwareVersion;
  }

  specificationsChanged(device: Device): boolean {
    const v = this.specificationsForm.getRawValue();
    return (
      v.manufacturer !== (device.manufacturer ?? '') ||
      v.model !== (device.model ?? '') ||
      v.firmwareVersion !== (device.firmwareVersion ?? '')
    );
  }

  branchChanged(device: Device): boolean {
    return this.branchForm.getRawValue().branchId !== (device.branchId ?? '');
  }

  hasCalibration(device: Device): boolean {
    return device.unitStockWeight !== null && !!device.weightUnitName;
  }

  hasDisplayMode(device: Device): boolean {
    return !!device.displayMode;
  }

  displayModeChanged(device: Device): boolean {
    return (
      this.displayModeForm.getRawValue().displayMode !==
      (device.displayMode ?? 'DISPLAY_MODE_ENVIRONMENT')
    );
  }

  batchName(id: string): string {
    const batches = this.resourceStore.rows();
    const batch = batches.find((row) => row.id === id);
    if (batch) return `${batch.code} · ${batch.supplyName}`;
    return batches.length === 0
      ? this.translateService.instant('devices.onboarding.operationalSummary.loadingBatch')
      : this.translateService.instant('devices.onboarding.operationalSummary.unknownBatch');
  }

  branchName(id: string): string {
    const branches = this.resourceStore.branches();
    const branch = branches.find((b) => b.id === id);
    if (branch) return branch.name;
    return branches.length === 0
      ? this.translateService.instant('devices.onboarding.operationalSummary.loadingBranch')
      : id;
  }

  selectedBatchCustomSupplyId(device: Device): string {
    const batch = this.resourceStore.rows().find((row) => row.id === device.assignedBatchId);
    return batch?.customSupplyId ?? '';
  }

  private prefillThresholds(): void {
    const device = this.currentDevice();
    if (!device?.assignedBatchId) return;

    const threshold = device.supplyThresholdId
      ? this.thresholdsStore.thresholds().find((item) => item.id === device.supplyThresholdId)
      : undefined;

    if (threshold) {
      this.thresholdsForm.patchValue(
        {
          minStock: threshold.minStock,
          maxStock: threshold.maxStock,
          anomalyThreshold: threshold.anomalyThreshold,
          minTemperature: threshold.minTemperature,
          maxTemperature: threshold.maxTemperature,
          minHumidity: threshold.minHumidity,
          maxHumidity: threshold.maxHumidity,
        },
        { emitEvent: false },
      );
      return;
    }

    const customSupplyId = this.selectedBatchCustomSupplyId(device);
    if (!customSupplyId) return;

    const customSupply = this.resourceStore
      .customSupplies()
      .find((supply) => supply.id === customSupplyId);
    if (!customSupply) return;

    this.thresholdsForm.patchValue(
      {
        minStock: customSupply.minStock,
        maxStock: customSupply.maxStock,
      },
      { emitEvent: false },
    );
  }

  private prefillCalibration(): void {
    const device = this.currentDevice();
    if (!device?.assignedBatchId) return;

    if (device.unitStockWeight !== null || device.tareWeight !== null || device.weightUnitName) {
      const unit = this.weightUnitOption(device.weightUnitName, device.weightUnitAbbreviation);
      this.calibrationForm.patchValue(
        {
          unitStockWeight: device.unitStockWeight,
          tareWeight: device.tareWeight ?? 0,
          weightUnitName: unit.name,
          weightUnitAbbreviation: unit.abbr,
        },
        { emitEvent: false },
      );
      return;
    }

    const customSupplyId = this.selectedBatchCustomSupplyId(device);
    if (!customSupplyId) return;

    const customSupply = this.resourceStore
      .customSupplies()
      .find((supply) => supply.id === customSupplyId);
    if (!customSupply) return;

    const unit = this.weightUnitOption(customSupply.unit.name, customSupply.unit.abbreviation);
    this.calibrationForm.patchValue(
      {
        weightUnitName: unit.name,
        weightUnitAbbreviation: unit.abbr,
      },
      { emitEvent: false },
    );
  }

  private weightUnitOption(
    name?: string | null,
    abbreviation?: string | null,
  ): { name: string; abbr: string } {
    const normalizedName = (name ?? '').toLowerCase().trim();
    const normalizedAbbr = (abbreviation ?? '').toLowerCase().trim();

    return (
      this.weightUnits.find((unit) => {
        const unitName = unit.name.toLowerCase();
        const unitAbbr = unit.abbr.toLowerCase();
        return (
          normalizedName === unitName ||
          normalizedName === `${unitName}s` ||
          normalizedAbbr === unitAbbr
        );
      }) ?? this.weightUnits[0]
    );
  }

  onWeightUnitChange(event: Event): void {
    const name = (event.target as HTMLSelectElement).value;
    const unit = this.weightUnits.find((u) => u.name === name);
    if (unit) this.calibrationForm.patchValue({ weightUnitAbbreviation: unit.abbr });
  }

  openAssignBatchDialog(): void {
    this.resourceStore.loadInventoryContext(this.accountId);
    this.showAssignBatchDialog.set(true);
  }
  closeAssignBatchDialog(): void {
    this.showAssignBatchDialog.set(false);
  }

  submitAssignBatch(): void {
    if (this.assignBatchForm.invalid || !this.currentDevice()) return;
    this.loading.set(true);
    this.pageError.set(null);
    const { batchId } = this.assignBatchForm.value;
    const device = this.currentDevice()!;

    this.devicesStore.assignBatch(device.id, batchId).subscribe({
      next: (updated) => {
        this.currentDevice.set(updated);
        this.loading.set(false);
        this.showAssignBatchDialog.set(false);
      },
      error: (err) => {
        this.pageError.set(
          err?.message ?? this.translateService.instant('devices.onboarding.errors.assignBatch'),
        );
        this.loading.set(false);
      },
    });
  }

  saveThresholds(): void {
    if (this.thresholdsForm.invalid || !this.currentDevice()) return;
    this.loading.set(true);
    this.pageError.set(null);
    const v = this.thresholdsForm.value;
    const device = this.currentDevice()!;
    const customSupplyId = this.selectedBatchCustomSupplyId(device);
    if (!customSupplyId) {
      this.pageError.set(
        this.translateService.instant('devices.onboarding.errors.batchNotAvailable'),
      );
      this.loading.set(false);
      return;
    }

    of(device)
      .pipe(
        switchMap((updated) => this.saveSpecificationsIfNeeded(updated)),
        switchMap((updated) => this.assignBranchIfNeeded(updated)),
        switchMap((updated) =>
          this.thresholdsStore.createThreshold({
            deviceId: updated.id,
            accountId: this.accountId,
            customSupplyId,
            minStock: v.minStock,
            maxStock: v.maxStock,
            anomalyThreshold: v.anomalyThreshold ?? 0,
            minTemperatureCelsius: v.minTemperature ?? undefined,
            maxTemperatureCelsius: v.maxTemperature ?? undefined,
            minHumidityPercentage: v.minHumidity ?? undefined,
            maxHumidityPercentage: v.maxHumidity ?? undefined,
          }),
        ),
        switchMap(() => this.devicesStore.fetchDeviceById(device.id)),
      )
      .subscribe({
        next: (updated) => {
          this.currentDevice.set(updated);
          this.loading.set(false);
        },
        error: (err) => {
          this.pageError.set(
            err?.message ??
            this.translateService.instant('devices.onboarding.errors.saveThresholds'),
          );
          this.loading.set(false);
        },
      });
  }

  saveSpecifications(): void {
    if (this.specificationsForm.invalid || !this.currentDevice()) return;
    this.loading.set(true);
    this.pageError.set(null);

    this.devicesStore
      .addSpecifications(this.currentDevice()!.id, this.specificationsForm.getRawValue())
      .subscribe({
        next: (updated) => {
          this.currentDevice.set(updated);
          this.loading.set(false);
        },
        error: (err) => {
          this.pageError.set(
            err?.message ??
            this.translateService.instant('devices.onboarding.errors.saveSpecifications'),
          );
          this.loading.set(false);
        },
      });
  }

  saveBranch(): void {
    if (this.branchForm.invalid || !this.currentDevice()) return;
    this.loading.set(true);
    this.pageError.set(null);

    this.devicesStore
      .assignBranch(this.currentDevice()!.id, this.branchForm.getRawValue().branchId)
      .subscribe({
        next: (updated) => {
          this.currentDevice.set(updated);
          this.loading.set(false);
        },
        error: (err) => {
          this.pageError.set(
            err?.message ?? this.translateService.instant('devices.onboarding.errors.assignBranch'),
          );
          this.loading.set(false);
        },
      });
  }

  private saveSpecificationsIfNeeded(device: Device): Observable<Device> {
    this.currentDevice.set(device);
    if (this.hasSpecifications(device) && !this.specificationsChanged(device)) {
      return of(device);
    }
    if (this.specificationsForm.invalid) {
      this.specificationsForm.markAllAsTouched();
      throw new Error(this.translateService.instant('devices.onboarding.errors.completeSpecs'));
    }
    return this.devicesStore.addSpecifications(device.id, this.specificationsForm.getRawValue());
  }

  private assignBranchIfNeeded(device: Device): Observable<Device> {
    this.currentDevice.set(device);
    if (device.branchId && !this.branchChanged(device)) {
      return of(device);
    }
    if (this.branchForm.invalid) {
      this.branchForm.markAllAsTouched();
      throw new Error(this.translateService.instant('devices.onboarding.errors.assignBranchFirst'));
    }
    return this.devicesStore.assignBranch(device.id, this.branchForm.getRawValue().branchId);
  }

  saveCalibration(): void {
    if (this.calibrationForm.invalid || !this.currentDevice()) return;
    this.loading.set(true);
    this.pageError.set(null);
    const device = this.currentDevice()!;
    const measurement = this.calibrationForm.getRawValue();
    const grossWeight = (measurement.unitStockWeight ?? 0) + (measurement.tareWeight ?? 0);

    this.devicesStore
      .updateMeasurement(device.id, {
        unitStockWeight: measurement.unitStockWeight ?? 0,
        tareWeight: measurement.tareWeight ?? 0,
        grossWeight,
        calibrationDate: new Date().toISOString().split('T')[0],
        weightUnitName: measurement.weightUnitName,
        weightUnitAbbreviation: measurement.weightUnitAbbreviation,
      })
      .subscribe({
        next: (updated) => {
          this.currentDevice.set(updated);
          this.loading.set(false);
        },
        error: (err) => {
          this.pageError.set(
            err?.message ?? this.translateService.instant('devices.onboarding.errors.calibrate'),
          );
          this.loading.set(false);
        },
      });
  }

  resetTare(): void {
    this.calibrationForm.patchValue({ tareWeight: 0 });
  }

  saveDisplayMode(): void {
    if (this.displayModeForm.invalid || !this.currentDevice()) return;
    this.loading.set(true);
    this.pageError.set(null);
    const device = this.currentDevice()!;
    const { displayMode } = this.displayModeForm.getRawValue();

    this.devicesStore.updateDisplayMode(device.id, displayMode).subscribe({
      next: (updated) => {
        this.currentDevice.set(updated);
        this.loading.set(false);
      },
      error: (err) => {
        this.pageError.set(
          err?.message ??
          this.translateService.instant('devices.onboarding.errors.saveDisplayMode'),
        );
        this.loading.set(false);
      },
    });
  }

  openUnlinkConfirm(): void {
    this.showUnlinkDialog.set(true);
  }
  closeUnlinkConfirm(): void {
    this.showUnlinkDialog.set(false);
    this.unlinkConfirmText = '';
  }

  confirmUnlink(): void {
    if (!this.currentDevice()) return;
    this.loading.set(true);
    this.pageError.set(null);
    this.devicesStore.updateStatus(this.currentDevice()!.id, 'INACTIVE').subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/devices']);
      },
      error: (err) => {
        this.pageError.set(
          err?.message ?? this.translateService.instant('devices.onboarding.errors.unlink'),
        );
        this.loading.set(false);
      },
    });
  }

  goToList(): void {
    this.router.navigate(['/devices']);
  }
}
