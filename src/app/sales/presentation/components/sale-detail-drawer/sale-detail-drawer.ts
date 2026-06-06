import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sale } from '../../../domain/model/sale.entity';

@Component({
  selector: 'app-sale-detail-drawer',
  imports: [CommonModule],
  templateUrl: './sale-detail-drawer.html',
  styleUrl: './sale-detail-drawer.css',
})
export class SaleDetailDrawer {
  @Input({ required: true }) sale!: Sale;
  @Output() closed = new EventEmitter<void>();

  close(): void {
    this.closed.emit();
  }
}
