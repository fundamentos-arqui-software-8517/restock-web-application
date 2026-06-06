import { AfterViewChecked, Component, computed, effect, inject, OnInit, untracked, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RegisterDeviceDialog } from '../device-onboarding/register-device-dialog';
import { Device } from '../../../domain/model/device.entity';
import { DevicesStore } from '../../../application/devices.store';
import { IamStore } from '../../../../iam/application/iam.store';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-devices-list',
  imports: [
    MatSort,
    MatPaginator,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinner,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatSortHeader,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    MatChipsModule,
  ],
  templateUrl: './devices-list.html',
  styleUrls: ['./devices-list.css'],
})
export class DevicesList implements AfterViewChecked, OnInit {
  readonly store = inject(DevicesStore);
  readonly iamStore = inject(IamStore);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  displayedColumns: string[] = ['macAddress', 'description', 'status', 'firmware', 'actions'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly configuredCount = computed(() =>
    this.store.devices().filter(d => d.status === 'CONFIGURED' || d.status === 'ACTIVE').length
  );

  readonly registeredCount = computed(() =>
    this.store.devices().filter(d => d.status === 'REGISTERED').length
  );

  readonly inactiveCount = computed(() =>
    this.store.devices().filter(d => d.status === 'INACTIVE').length
  );

  readonly dataSource = computed(() => new MatTableDataSource(this.store.devices()));

  constructor() {
    effect(() => {
      const accountId = this.iamStore.currentUser()?.accountId ?? '';
      untracked(() => this.store.loadDevicesForAccount(accountId));
    });
  }

  ngOnInit(): void {}

  ngAfterViewChecked(): void {
    const ds = this.dataSource();
    if (ds.paginator !== this.paginator) ds.paginator = this.paginator;
    if (ds.sort !== this.sort) ds.sort = this.sort;
  }

  navigateToOnboarding(): void {
    const ref = this.dialog.open(RegisterDeviceDialog, { autoFocus: 'first-tabbable' });
    ref.afterClosed().subscribe((device: Device | undefined) => {
      if (device) this.router.navigate(['/devices/onboarding'], { state: { device } });
      else this.store.loadDevicesForAccount(this.iamStore.currentUser()?.accountId ?? '');
    });
  }

  navigateToDevice(device: Device): void {
    this.router.navigate(['/devices/onboarding'], { state: { device } });
  }

  deactivate(deviceId: string): void {
    this.store.updateStatus(deviceId, 'INACTIVE').subscribe();
  }
}
