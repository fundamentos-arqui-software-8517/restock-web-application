import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { DevicesStore } from '../../../application/devices.store';
import { IamStore } from '../../../../iam/application/iam.store';
import { Device } from '../../../domain/model/device.entity';

@Component({
  selector: 'app-register-device-dialog',
  imports: [ReactiveFormsModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './register-device-dialog.html',
  styleUrls: ['./register-device-dialog.css'],
})
export class RegisterDeviceDialog {
  private readonly devicesStore = inject(DevicesStore);
  private readonly iamStore = inject(IamStore);
  private readonly dialogRef = inject(MatDialogRef<RegisterDeviceDialog>);
  private readonly fb = inject(FormBuilder);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form: FormGroup = this.fb.group({
    macAddress: ['', [Validators.required, Validators.pattern(/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/)]],
    description: ['', Validators.required],
  });

  private get accountId(): string {
    return this.iamStore.currentUser()?.accountId ?? '';
  }

  register(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set(null);
    const { macAddress, description } = this.form.value;
    this.devicesStore.createDevice({ accountId: this.accountId, macAddress, description }).subscribe({
      next: (device: Device) => this.dialogRef.close(device),
      error: (err: { message?: string }) => {
        this.error.set(err?.message ?? 'Failed to register device');
        this.loading.set(false);
      },
    });
  }

  cancel(): void { this.dialogRef.close(); }
}
