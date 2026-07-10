import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { SalesOrderEntity } from '../../../domain/model/sales-order.entity';

/**
 * "Sale Registered Successfully" confirmation modal, shown right after
 * completeOrder() succeeds.
 */
@Component({
  selector: 'app-sale-success-modal',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './sale-success-modal.html',
  styleUrl: './sale-success-modal.css',
})
export class SaleSuccessModalComponent {
  @Input() order: SalesOrderEntity | null = null;
  @Output() startNewSale = new EventEmitter<void>();
  @Output() backToSales = new EventEmitter<void>();
}
