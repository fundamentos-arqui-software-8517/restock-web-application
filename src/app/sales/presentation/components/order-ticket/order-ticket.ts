import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { SalesOrderEntity } from '../../../domain/model/sales-order.entity';
import { SalesOrderItemEntity } from '../../../domain/model/sales-order-item.entity';

/**
 * Right-hand "Order Ticket" panel of the POS screen. Shows the items in the
 * active order with quantity steppers, the subtotal/tax/total breakdown and
 * the primary actions. 100% presentational — the view (New Sale) owns the
 * SalesStore and reacts to these outputs.
 */
@Component({
  selector: 'app-order-ticket',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './order-ticket.html',
  styleUrl: './order-ticket.css',
})
export class OrderTicketComponent {
  @Input() order: SalesOrderEntity | null = null;
  @Input() saving = false;

  @Output() adjustQuantity = new EventEmitter<{ item: SalesOrderItemEntity; delta: number }>();
  @Output() removeItem = new EventEmitter<string>();
  @Output() completeOrder = new EventEmitter<void>();
  @Output() clearOrder = new EventEmitter<void>();
}
