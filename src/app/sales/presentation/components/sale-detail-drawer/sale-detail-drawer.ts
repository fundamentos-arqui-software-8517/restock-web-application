import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Sale } from '../../../domain/model/sale.entity';

@Component({
  selector: 'app-sale-detail-drawer',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './sale-detail-drawer.html',
  styleUrl: './sale-detail-drawer.css',
})
export class SaleDetailDrawer {
  @Input({ required: true }) sale!: Sale;
  @Output() closed = new EventEmitter<void>();

  close(): void {
    this.closed.emit();
  }

  statusLabel(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'sales.table.statusLabel.logged';
      case 'CANCELLED':
        return 'sales.table.statusLabel.failed';
      default:
        return 'sales.table.statusLabel.pending';
    }
  }
}
