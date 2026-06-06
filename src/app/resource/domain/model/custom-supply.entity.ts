import { Supply } from './supply.entity';
import { UnitMeasure } from './unit-measure.entity';
import { BaseEntity } from '../../../shared/domain/model/base-entity';

export interface StockRange {
  minimumStock: number;
  maximumStock: number;
}

export interface Money {
  amount: number;
  currencyCode: string;
}

/**
 * Represents a custom supply configured by an account.
 *
 * A custom supply extends a base supply with account-specific information,
 * such as price, stock limits, image and unit of measurement.
 */
export class CustomSupply implements BaseEntity {
  private constructor(
    public readonly id: string,
    public readonly accountId: string,
    public readonly name: string,
    public readonly supplyId: string,
    public readonly supply: Supply,
    public readonly stockRange: StockRange,
    private _unitPrice: Money,
    public readonly description: string,
    public readonly unitMeasurement: UnitMeasure,
    public readonly pictureUrl: string,
  ) {
    this.validateUnitPrice(_unitPrice.amount);
    this.validateStockLimits(stockRange.minimumStock, stockRange.maximumStock);
  }

  /**
   * Creates a new custom supply entity.
   *
   * @param id Unique custom supply identifier.
   * @param accountId Account identifier that owns the custom supply.
   * @param name Custom supply name.
   * @param supplyId Identifier of the base supply.
   * @param unitPrice Unit price assigned by the account.
   * @param supply Base supply document.
   * @param stockRange Minimum and maximum expected stock.
   * @param description Custom supply description.
   * @param unitMeasurement Unit measure document.
   * @param pictureUrl Image URL of the custom supply.
   * @returns A new {@link CustomSupply} instance.
   */
  static create(
    id: string,
    accountId: string,
    name: string,
    supplyId: string,
    supply: Supply,
    stockRange: StockRange,
    unitPrice: Money,
    description: string,
    unitMeasurement: UnitMeasure,
    pictureUrl: string,
  ): CustomSupply {
    return new CustomSupply(
      id,
      accountId,
      name,
      supplyId,
      supply,
      stockRange,
      unitPrice,
      description,
      unitMeasurement,
      pictureUrl,
    );
  }

  /**
   * Creates an empty custom supply instance.
   *
   * @returns An empty {@link CustomSupply} instance.
   */
  static empty(): CustomSupply {
    return new CustomSupply(
      '',
      '',
      '',
      '',
      Supply.empty(),
      { minimumStock: 0, maximumStock: 0 },
      { amount: 0, currencyCode: 'PEN' },
      '',
      UnitMeasure.empty(),
      '',
    );
  }

  /**
   * Gets the current unit price.
   *
   * @returns Unit price value.
   */
  get unitPrice(): number {
    return this._unitPrice.amount;
  }

  get unitPriceCurrencyCode(): string {
    return this._unitPrice.currencyCode;
  }

  /**
   * Gets the minimum stock value.
   *
   * @returns Minimum stock value.
   */
  get minStock(): number {
    return this.stockRange.minimumStock;
  }

  /**
   * Gets the maximum stock value.
   *
   * @returns Maximum stock value.
   */
  get maxStock(): number {
    return this.stockRange.maximumStock;
  }

  get category(): string {
    return this.supply.category;
  }

  get unit(): UnitMeasure {
    return this.unitMeasurement;
  }

  get imgUrl(): string {
    return this.pictureUrl;
  }

  /**
   * Checks whether the supply is perishable.
   *
   * @returns True if the base supply is perishable; otherwise, false.
   */
  isPerishable(): boolean {
    return this.supply.isPerishable;
  }

  /**
   * Updates the unit price.
   *
   * @param unitPrice New unit price.
   */
  updateUnitPrice(unitPrice: number): void {
    this.validateUnitPrice(unitPrice);
    this._unitPrice = { ...this._unitPrice, amount: unitPrice };
  }

  /**
   * Updates the stock limits.
   *
   * @param minStock New minimum stock.
   * @param maxStock New maximum stock.
   */
  updateStockLimits(minStock: number, maxStock: number): void {
    this.validateStockLimits(minStock, maxStock);
    this.stockRange.minimumStock = minStock;
    this.stockRange.maximumStock = maxStock;
  }

  /**
   * Validates that the unit price is not negative.
   *
   * @param unitPrice Unit price to validate.
   * @throws Error if the unit price is negative.
   */
  private validateUnitPrice(unitPrice: number): void {
    if (unitPrice < 0) {
      throw new Error('Custom supply unit price cannot be negative.');
    }
  }

  /**
   * Validates the minimum and maximum stock limits.
   *
   * @param minStock Minimum stock value.
   * @param maxStock Maximum stock value.
   * @throws Error if stock limits are invalid.
   */
  private validateStockLimits(minStock: number, maxStock: number): void {
    if (minStock < 0 || maxStock < 0) {
      throw new Error('Stock limits cannot be negative.');
    }

    if (maxStock < minStock) {
      throw new Error('Maximum stock cannot be lower than minimum stock.');
    }
  }
}
