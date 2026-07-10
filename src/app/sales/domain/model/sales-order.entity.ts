import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { SalesOrderItemEntity } from './sales-order-item.entity';
import { SalesOrderStatus } from './sales-order-status.enum';

/**
 * Aggregate root for a Sales Order (POS transaction / ticket).
 * Maps to SalesOrderResource.
 */
export class SalesOrderEntity implements BaseEntity {
  id!: string;
  branchId!: string;
  status!: SalesOrderStatus;
  items!: SalesOrderItemEntity[];
  subtotalAmount!: number;
  taxAmount!: number;
  totalAmount!: number;
  currency!: string;
  createdAt!: string | null;

  constructor(partial?: Partial<SalesOrderEntity>) {
    this.items = [];
    Object.assign(this, partial);
  }

  get itemsCount(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }
}
