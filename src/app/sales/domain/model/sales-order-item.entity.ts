import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { IngredientResolved } from './ingredient-resolved.model';
import { SalesProductType } from '../command/add-product-to-order.command';

/**
 * A single line inside a SalesOrder (a kit, recipe or custom supply sold,
 * with the quantity requested). Maps to SalesOrderItemResource.
 */
export class SalesOrderItemEntity implements BaseEntity {
  id!: string;
  productId!: string;
  productType!: SalesProductType;
  nameSnapshot!: string;
  unitPrice!: number;
  quantity!: number;
  ingredientsResolved!: IngredientResolved[];

  constructor(partial?: Partial<SalesOrderItemEntity>) {
    this.ingredientsResolved = [];
    Object.assign(this, partial);
  }

  get lineTotal(): number {
    return this.unitPrice * this.quantity;
  }
}
