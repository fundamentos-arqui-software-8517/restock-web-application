import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { TrackingStore } from '../../../application/tracking.store';

type CalibrationAction = 'force_tare' | 'schedule_maintenance';

/**
 * Recalibrate Scale dialog.
 *
 * Allows the user to choose a calibration action for a smart scale device,
 * optionally providing a note, and submitting the recalibration request.
 */
@Component({
  selector: 'app-recalibrate-scale-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './recalibrate-scale-dialog.html',
  styleUrl: './recalibrate-scale-dialog.css',
})
export class RecalibrateScaleDialog {
  @Output() onClose = new EventEmitter<void>();
  @Output() onRecalibrate = new EventEmitter<void>();

  readonly store = inject(TrackingStore);

  selectedAction = signal<CalibrationAction>('force_tare');
  recalibrationNote = '';

  cancel(): void {
    this.onClose.emit();
  }

  confirm(): void {
    this.store.recalibrateScale('', this.selectedAction(), this.recalibrationNote);
    this.onRecalibrate.emit();
  }
}
