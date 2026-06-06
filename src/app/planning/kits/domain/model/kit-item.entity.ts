import { BaseEntity } from '../../../../shared/domain/model/base-entity';

/**
 * Represents a single item line of a Kit.
 * Maps directly to your Backend Ingredient structure.
 */
export class KitItemEntity implements BaseEntity {
  id!: string;
  productId!: string;
  customSupplyId!: string;
  quantity!: number;
  totalCost!: number;

  constructor(partial?: Partial<KitItemEntity>) {
    Object.assign(this, partial);
  }
}
