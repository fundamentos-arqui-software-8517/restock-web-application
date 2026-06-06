import { Component, effect, inject, OnInit, signal, untracked } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, of, switchMap } from 'rxjs';

import { DevicesStore } from '../../../application/devices.store';
import { DeviceThresholdsStore } from '../../../application/device-thresholds.store';
import { IamStore } from '../../../../iam/application/iam.store';
import { ResourceStore } from '../../../../resource/application/resource.store';
import { Device } from '../../../domain/model/device.entity';
import { DeviceStatus } from '../../../domain/model/device-status';

@Component({
  selector: 'app-device-onboarding',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './device-onboarding.html',
  styleUrls: ['./device-onboarding.css'],
})
export class DeviceOnboarding implements OnInit {
  private readonly devicesStore = inject(DevicesStore);
  private readonly thresholdsStore = inject(DeviceThresholdsStore);
  private readonly iamStore = inject(IamStore);
  readonly resourceStore = inject(ResourceStore);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly currentDevice = signal<Device | null>(null);
  readonly loading = signal(false);
  readonly pageError = signal<string | null>(null);
  readonly showAssignBatchDialog = signal(false);
  readonly showUnlinkDialog = signal(false);
  unlinkConfirmText = '';

  readonly weightUnits = [
    { name: 'gram', abbr: 'g' },
    { name: 'kilogram', abbr: 'kg' },
    { name: 'pound', abbr: 'lb' },
  ];

  readonly assignBatchForm: FormGroup = this.fb.group({
    batchId: ['', Validators.required],
    netWeight: [null, [Validators.required, Validators.min(0)]],
    tareWeight: [0, [Validators.required, Validators.min(0)]],
    weightUnitName: ['gram', Validators.required],
    weightUnitAbbreviation: ['g', Validators.required],
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
    anomalyThreshold: [0, [Validators.min(0)]],
    minTemperature: [null],
    maxTemperature: [null],
    minHumidity: [null, [Validators.min(0), Validators.max(100)]],
    maxHumidity: [null, [Validators.min(0), Validators.max(100)]],
  });

  constructor() {
    effect(() => {
      const accountId = this.iamStore.currentUser()?.accountId ?? '';
      if (accountId) {
        untracked(() => this.resourceStore.loadCustomSuppliesByAccount(accountId));
      }
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
        netWeight: s._netWeight ?? s.netWeight ?? null,
        tareWeight: s._tareWeight ?? s.tareWeight ?? null,
        grossWeight: s._grossWeight ?? s.grossWeight ?? null,
        calibrationDate: s._calibrationDate ?? s.calibrationDate ?? null,
        weightUnitName: s._weightUnitName ?? s.weightUnitName ?? null,
        weightUnitAbbreviation: s._weightUnitAbbreviation ?? s.weightUnitAbbreviation ?? null,
        justifiedWithdrawnStock: s._justifiedWithdrawnStock ?? s.justifiedWithdrawnStock ?? 0,
      });
      this.currentDevice.set(device);
      this.specificationsForm.patchValue({
        manufacturer: device.manufacturer ?? '',
        model: device.model ?? '',
        firmwareVersion: device.firmwareVersion ?? '',
      });
      this.branchForm.patchValue({ branchId: device.branchId ?? '' });
    } else {
      this.router.navigate(['/devices']);
    }
    this.thresholdsStore.loadThresholdsForAccount(this.accountId);
  }

  private get accountId(): string {
    return this.iamStore.currentUser()?.accountId ?? '';
  }

  statusLabel(status: DeviceStatus): string {
    const labels: Record<DeviceStatus, string> = {
      REGISTERED: 'AWAITING SETUP',
      CONFIGURED: 'CONFIGURED',
      ACTIVE: 'Online',
      INACTIVE: 'Inactive',
    };
    return labels[status];
  }

  statusClass(status: DeviceStatus): string {
    const classes: Record<DeviceStatus, string> = {
      REGISTERED: 'badge-pending',
      CONFIGURED: 'badge-configured',
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
    return v.manufacturer !== (device.manufacturer ?? '')
      || v.model !== (device.model ?? '')
      || v.firmwareVersion !== (device.firmwareVersion ?? '');
  }

  branchChanged(device: Device): boolean {
    return this.branchForm.getRawValue().branchId !== (device.branchId ?? '');
  }

  batchName(id: string): string {
    const supplies = this.resourceStore.customSupplies();
    const batch = supplies.find(s => s.id === id);
    if (batch) return batch.name;
    return supplies.length === 0 ? 'Loading batch...' : 'Unknown batch';
  }

  onWeightUnitChange(event: Event): void {
    const name = (event.target as HTMLSelectElement).value;
    const unit = this.weightUnits.find(u => u.name === name);
    if (unit) this.assignBatchForm.patchValue({ weightUnitAbbreviation: unit.abbr });
  }

  openAssignBatchDialog(): void {
    this.resourceStore.loadCustomSuppliesByAccount(this.accountId);
    this.showAssignBatchDialog.set(true);
  }
  closeAssignBatchDialog(): void { this.showAssignBatchDialog.set(false); }

  submitAssignBatch(): void {
    if (this.assignBatchForm.invalid || !this.currentDevice()) return;
    this.loading.set(true);
    this.pageError.set(null);
    const { batchId, netWeight, tareWeight, weightUnitName, weightUnitAbbreviation } = this.assignBatchForm.value;
    const device = this.currentDevice()!;
    const grossWeight = (netWeight ?? 0) + (tareWeight ?? 0);
    const calibrationDate = new Date().toISOString().split('T')[0];

    this.devicesStore.assignBatch(device.id, batchId).pipe(
      switchMap(updated => {
        this.currentDevice.set(updated);
        return this.devicesStore.updateMeasurement(updated.id, {
          netWeight: netWeight ?? 0,
          tareWeight: tareWeight ?? 0,
          grossWeight,
          calibrationDate,
          weightUnitName,
          weightUnitAbbreviation,
        });
      }),
    ).subscribe({
      next: updated => {
        this.currentDevice.set(updated);
        this.loading.set(false);
        this.showAssignBatchDialog.set(false);
        this.assignBatchForm.reset({ tareWeight: 0, weightUnitName: 'gram', weightUnitAbbreviation: 'g' });
      },
      error: err => { this.pageError.set(err?.message ?? 'Failed to assign batch'); this.loading.set(false); },
    });
  }

  saveThresholds(): void {
    if (this.thresholdsForm.invalid || !this.currentDevice()) return;
    this.loading.set(true);
    this.pageError.set(null);
    const v = this.thresholdsForm.value;
    const device = this.currentDevice()!;

    this.thresholdsStore.createThreshold({
      accountId: this.accountId,
      customSupplyId: device.assignedBatchId ?? '',
      minStock: v.minStock,
      maxStock: v.maxStock,
      anomalyThreshold: v.anomalyThreshold ?? 0,
      minTemperature: v.minTemperature ?? undefined,
      maxTemperature: v.maxTemperature ?? undefined,
      minHumidity: v.minHumidity ?? undefined,
      maxHumidity: v.maxHumidity ?? undefined,
    }).pipe(
      switchMap(threshold => this.devicesStore.assignThreshold(device.id, threshold.id)),
      switchMap(updated => this.saveSpecificationsIfNeeded(updated)),
      switchMap(updated => this.assignBranchIfNeeded(updated)),
      switchMap(updated => this.devicesStore.updateStatus(updated.id, 'CONFIGURED')),
    ).subscribe({
      next: updated => { this.currentDevice.set(updated); this.loading.set(false); },
      error: err => { this.pageError.set(err?.message ?? 'Failed to save thresholds'); this.loading.set(false); },
    });
  }

  saveSpecifications(): void {
    if (this.specificationsForm.invalid || !this.currentDevice()) return;
    this.loading.set(true);
    this.pageError.set(null);

    this.devicesStore.addSpecifications(this.currentDevice()!.id, this.specificationsForm.getRawValue()).subscribe({
      next: updated => { this.currentDevice.set(updated); this.loading.set(false); },
      error: err => { this.pageError.set(err?.message ?? 'Failed to save specifications'); this.loading.set(false); },
    });
  }

  saveBranch(): void {
    if (this.branchForm.invalid || !this.currentDevice()) return;
    this.loading.set(true);
    this.pageError.set(null);

    this.devicesStore.assignBranch(this.currentDevice()!.id, this.branchForm.getRawValue().branchId).subscribe({
      next: updated => { this.currentDevice.set(updated); this.loading.set(false); },
      error: err => { this.pageError.set(err?.message ?? 'Failed to assign branch'); this.loading.set(false); },
    });
  }

  private saveSpecificationsIfNeeded(device: Device): Observable<Device> {
    this.currentDevice.set(device);
    if (this.hasSpecifications(device) && !this.specificationsChanged(device)) {
      return of(device);
    }
    if (this.specificationsForm.invalid) {
      this.specificationsForm.markAllAsTouched();
      throw new Error('Complete hardware specifications before saving thresholds');
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
      throw new Error('Assign a branch before saving thresholds');
    }
    return this.devicesStore.assignBranch(device.id, this.branchForm.getRawValue().branchId);
  }

  resetTare(): void {
    if (!this.currentDevice()) return;
    this.loading.set(true);
    this.pageError.set(null);
    const device = this.currentDevice()!;
    this.devicesStore.updateMeasurement(device.id, {
      netWeight: device.netWeight ?? 0,
      tareWeight: 0,
      grossWeight: device.netWeight ?? 0,
      calibrationDate: new Date().toISOString().split('T')[0],
      weightUnitName: device.weightUnitName ?? 'gram',
      weightUnitAbbreviation: device.weightUnitAbbreviation ?? 'g',
    }).subscribe({
      next: updated => { this.currentDevice.set(updated); this.loading.set(false); },
      error: err => { this.pageError.set(err?.message ?? 'Failed to reset tare'); this.loading.set(false); },
    });
  }

  openUnlinkConfirm(): void { this.showUnlinkDialog.set(true); }
  closeUnlinkConfirm(): void { this.showUnlinkDialog.set(false); this.unlinkConfirmText = ''; }

  confirmUnlink(): void {
    if (!this.currentDevice()) return;
    this.loading.set(true);
    this.pageError.set(null);
    this.devicesStore.updateStatus(this.currentDevice()!.id, 'INACTIVE').subscribe({
      next: () => { this.loading.set(false); this.router.navigate(['/devices']); },
      error: err => { this.pageError.set(err?.message ?? 'Failed to unlink device'); this.loading.set(false); },
    });
  }

  goToList(): void { this.router.navigate(['/devices']); }
}
