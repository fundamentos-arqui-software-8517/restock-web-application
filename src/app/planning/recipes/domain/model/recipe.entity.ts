import { BaseEntity } from '../../../../shared/domain/model/base-entity';
import { IngredientEntryEntity } from './ingredient-entry.entity';

export type RecipeStatus = 'ACTIVE' | 'INACTIVE' | 'LOW_STOCK';
export type ProductType = 'RECIPE' | 'KIT';

export class RecipeEntity implements BaseEntity {
  id!: string;
  accountId!: string;
  name!: string;
  description!: string;
  sku!: string;
  type!: ProductType;
  status!: RecipeStatus;
  imageUrl!: string;
  sellingPrice!: number;
  ingredients!: IngredientEntryEntity[];

  constructor(partial?: Partial<RecipeEntity>) {
    this.ingredients = [];
    Object.assign(this, partial);
  }

  /** Estimated cost = sum of all ingredient totalCost (server-calculated per line) */
  get estimatedCost(): number {
    return this.ingredients.reduce((sum, i) => sum + (i.totalCost ?? 0), 0);
  }
}