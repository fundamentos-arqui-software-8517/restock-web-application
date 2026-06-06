import { BaseEntity } from '../../../../shared/domain/model/base-entity';
import { KitItemEntity } from './kit-item.entity';

export type KitStatus = 'ACTIVE' | 'RESTOCK' | 'LOW_STOCK';
export type ProductType = 'RECIPE' | 'KIT';

/**
 * Aggregate root for Kit configuration.
 */
export class KitEntity implements BaseEntity {
  id!: string;
  accountId!: string;
  name!: string;
  description!: string;
  sku!: string;
  type!: ProductType;
  status!: KitStatus;
  imageUrl!: string;
  sellingPrice!: number;
  items!: KitItemEntity[];

  constructor(partial?: Partial<KitEntity>) {
    this.items = [];
    Object.assign(this, partial);
  }
}
