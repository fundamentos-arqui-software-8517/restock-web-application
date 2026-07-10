import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { TrackingStore } from '../../../application/tracking.store';
import { TRACKING_PATHS } from '../../tracking-paths';

type HistoryTab = 'resolved' | 'pending' | 'archived';

@Component({
  selector: 'app-resolution-history-view',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './resolution-history-view.html',
  styleUrl: './resolution-history-view.css',
})
export class ResolutionHistoryView implements OnInit {
  readonly store = inject(TrackingStore);
  readonly discrepanciesPath = TRACKING_PATHS.discrepancies.root;

  activeTab = signal<HistoryTab>('resolved');

  readonly resolvedTasks = computed(() =>
    this.store.conciliationTasks().filter(
      (t) => t.status === 'RESOLVED_MANUALLY' || t.status === 'RESOLVED_AUTOMATICALLY',
    ),
  );

  readonly criticalDeviations = computed(() =>
    this.store.conciliationTasks().filter((t) => Math.abs(t.difference) > 50).length,
  );

  readonly totalResolved = this.store.totalResolved;

  ngOnInit(): void {
    this.store.loadConciliationTasks(
      this.store.currentAccountId(),
      undefined,
    );
  }

  setTab(tab: HistoryTab): void {
    this.activeTab.set(tab);
  }

  getDeviationClass(difference: number): string {
    if (difference < 0) return 'deviation-negative';
    if (difference > 0) return 'deviation-positive';
    return 'deviation-sensor-fault';
  }

  getReasonClass(reason: string | null): string {
    switch (reason) {
      case 'WASTE_OR_SPOILAGE':   return 'reason-spoilage';
      case 'THEFT_OR_LOSS':       return 'reason-theft';
      case 'UNREGISTERED_USE':    return 'reason-unregistered';
      case 'TRANSFER_OR_DISPLAY': return 'reason-transfer';
      case 'SENSOR_FAULT':        return 'reason-sensor';
      default:                    return 'reason-default';
    }
  }

  get filteredHistory() {
    return this.resolvedTasks();
  }
}
