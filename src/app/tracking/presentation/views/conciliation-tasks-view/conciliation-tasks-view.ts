import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { TrackingStore } from '../../../application/tracking.store';
import { TRACKING_PATHS } from '../../tracking-paths';
import { ResolveDiscrepancyDialog } from '../../components/resolve-discrepancy-dialog/resolve-discrepancy-dialog';
import { IamStore } from '../../../../iam/application/iam.store';

@Component({
  selector: 'app-conciliation-tasks-view',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe, ResolveDiscrepancyDialog],
  templateUrl: './conciliation-tasks-view.html',
  styleUrl: './conciliation-tasks-view.css',
})
export class ConciliationTasksView implements OnInit {
  readonly store = inject(TrackingStore);
  readonly historyPath = TRACKING_PATHS.discrepancies.history;
  private readonly iamStore = inject(IamStore);

  filterStatus = 'ALL';
  showResolveDialog = false;
  selectedTaskId = signal('');

  ngOnInit(): void {
    const accountId = this.iamStore.currentUser()?.accountId ?? '';
    this.store.currentAccountId.set(accountId);
    this.store.loadConciliationTasks(accountId);
  }

  get filteredTasks() {
    const all = this.store.conciliationTasks();
    if (this.filterStatus === 'ALL') return all;
    return all.filter((t) => t.status === this.filterStatus);
  }

  setFilter(status: string): void {
    this.filterStatus = status;
  }

  openResolveDialog(taskId: string): void {
    this.selectedTaskId.set(taskId);
    this.showResolveDialog = true;
  }

  closeResolveDialog(): void {
    this.showResolveDialog = false;
    this.selectedTaskId.set('');
    // Reload to reflect resolved status
    const accountId = this.iamStore.currentUser()?.accountId ?? '';
    this.store.loadConciliationTasks(accountId);
  }

  getAlertClass(alertLevel: string): string {
    if (alertLevel === 'CRITICAL') return 'badge-critical';
    if (alertLevel === 'HIGH')     return 'badge-warning';
    return 'badge-low';
  }

  getStatusClass(status: string): string {
    if (status === 'PENDING')                return 'badge-pending';
    if (status === 'RESOLVED_MANUALLY')      return 'badge-resolved';
    if (status === 'RESOLVED_AUTOMATICALLY') return 'badge-resolved';
    return 'badge-low';
  }
}
