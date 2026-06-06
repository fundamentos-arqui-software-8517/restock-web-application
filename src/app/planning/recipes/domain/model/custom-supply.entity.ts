import { BaseEntity } from '../../../../shared/domain/model/base-entity';

/**
 * Represents a CustomSupply from the Resources BC.
 * Used to populate the ingredient selector and to resolve names/prices.
 */
export class CustomSupplyEntity implements BaseEntity {
  id!: string;
  name!: string;
  description!: string;
  supplyId!: string;
  supplyName!: string;
  categoryName!: string;
  unitPriceAmount!: number;
  unitPriceCurrencyCode!: string;
  unitMeasurement!: string;
  minimumStock!: number;
  maximumStock!: number;
  pictureUrl!: string;
  accountId!: string;

  constructor(partial?: Partial<CustomSupplyEntity>) {
    Object.assign(this, partial);
  }
}