import { BaseEntity } from '../../../../shared/domain/model/base-entity';

/**
 * Represents a single ingredient line of a Product (Recipe).
 * Maps to IngredientResource from the API.
 * Name and unit info are resolved by cross-referencing CustomSupplyEntity.
 */
export class IngredientEntryEntity implements BaseEntity {
  id!: string;
  productId!: string;
  customSupplyId!: string;
  quantity!: number;
  totalCost!: number;

  constructor(partial?: Partial<IngredientEntryEntity>) {
    Object.assign(this, partial);
  }
}