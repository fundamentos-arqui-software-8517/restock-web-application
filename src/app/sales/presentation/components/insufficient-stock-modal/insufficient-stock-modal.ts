import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { InsufficientStockError } from '../../../domain/model/insufficient-stock-error.model';

/**
 * "Action Blocked: Insufficient Physical Inventory" modal. Renders the
 * structured needed/available data the backend now returns (see
 * InsufficientStockException) instead of a generic error string.
 */
@Component({
  selector: 'app-insufficient-stock-modal',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './insufficient-stock-modal.html',
  styleUrl: './insufficient-stock-modal.css',
})
export class InsufficientStockModalComponent {
  @Input() error: InsufficientStockError | null = null;
  /** Name of the kit/recipe that couldn't be fulfilled, if known by the caller. */
  @Input() productName = '';
  @Output() removeItem = new EventEmitter<void>();
}
