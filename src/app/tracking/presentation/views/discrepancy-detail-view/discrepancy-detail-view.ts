import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { TrackingStore } from '../../../application/tracking.store';
import { ResolveDiscrepancyDialog } from '../../components/resolve-discrepancy-dialog/resolve-discrepancy-dialog';
import { RecalibrateScaleDialog } from '../../components/recalibrate-scale-dialog/recalibrate-scale-dialog';

/**
 * Discrepancy Detail view showing a single inventory discrepancy.
 *
 * Displays digital vs physical stock comparison, smart scale info,
 * asset metadata, a weight chart placeholder, and a system event log.
 */
@Component({
  selector: 'app-discrepancy-detail-view',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe, ResolveDiscrepancyDialog, RecalibrateScaleDialog],
  templateUrl: './discrepancy-detail-view.html',
  styleUrl: './discrepancy-detail-view.css',
})
export class DiscrepancyDetailView implements OnInit {
  private readonly route = inject(ActivatedRoute);
  readonly store = inject(TrackingStore);

  readonly params = toSignal(this.route.paramMap);

  showResolveDialog = false;
  showRecalibrateDialog = false;

  /** Holds the conciliation task ID to resolve — set when dialog opens */
  resolveTaskId = '';

  ngOnInit(): void {
    const id = this.params()?.get('id') ?? '';
    if (id) {
      this.store.loadDiscrepancyById(id);
    }
  }

  openResolveDialog(): void {
    this.resolveTaskId = this.params()?.get('id') ?? '';
    this.showResolveDialog = true;
  }

  closeResolveDialog(): void {
    this.showResolveDialog = false;
    this.resolveTaskId = '';
  }

  openRecalibrateDialog(): void {
    this.showRecalibrateDialog = true;
  }

  closeRecalibrateDialog(): void {
    this.showRecalibrateDialog = false;
  }
}
