import { CustomSupply } from './custom-supply.entity';
import { BaseEntity } from '../../../shared/domain/model/base-entity';

export interface Stock {
  stock: number;
  unitMeasurement: string;
}

/**
 * Represents an inventory batch associated with a custom supply.
 *
 * A batch stores the current quantity available in a specific branch and may
 * include an expiration date when the related supply is perishable.
 */
export class Batch implements BaseEntity {
  private constructor(
    public readonly id: string,
    public readonly code: string,
    private _currentStock: Stock,
    public readonly customSupplyId: string,
    public readonly branchId: string,
    public readonly accountId: string,
    public readonly expirationDate: string | null,
    public readonly entryDate: string | null,
    public readonly customSupply?: CustomSupply,
  ) {
    this.validateCurrentStock(_currentStock);
  }

  /**
   * Creates a new batch entity.
   *
   * @param id Unique batch identifier.
   * @param customSupplyId Identifier of the related custom supply.
   * @param branchId Identifier of the branch where the batch is stored.
   * @param currentQuantity Current available quantity.
   * @param expirationDate Optional expiration date.
   * @param accountId Account identifier that owns the batch.
   * @param customSupply Optional custom supply entity.
   * @returns A new {@link Batch} instance.
   */
  static create(
    id: string,
    code: string,
    currentStock: Stock,
    customSupplyId: string,
    branchId: string,
    accountId: string,
    expirationDate: string | null,
    entryDate: string | null,
    customSupply?: CustomSupply,
  ): Batch {
    return new Batch(
      id,
      code,
      currentStock,
      customSupplyId,
      branchId,
      accountId,
      expirationDate,
      entryDate,
      customSupply,
    );
  }

  /**
   * Creates an empty batch instance.
   *
   * This is useful for initializing forms before data is loaded.
   *
   * @returns An empty {@link Batch} instance.
   */
  static empty(): Batch {
    return new Batch('', '', { stock: 0, unitMeasurement: '' }, '', '', '', null, null);
  }

  get currentStock(): Stock {
    return this._currentStock;
  }

  /**
   * Gets the current quantity of the batch.
   *
   * @returns Current quantity value.
   */
  get currentQuantity(): number {
    return this._currentStock.stock;
  }

  get unitMeasurement(): string {
    return this._currentStock.unitMeasurement;
  }

  /**
   * Updates the current quantity of the batch.
   *
   * @param quantity New quantity value.
   */
  updateCurrentQuantity(quantity: number): void {
    this.changeCurrentStock({ ...this._currentStock, stock: quantity });
  }

  changeCurrentStock(currentStock: Stock): void {
    this.validateCurrentStock(currentStock);
    this._currentStock = currentStock;
  }

  /**
   * Checks whether the batch has already expired.
   *
   * @returns True if the batch is expired; otherwise, false.
   */
  isExpired(): boolean {
    if (!this.expirationDate) return false;

    const expirationDate = new Date(this.expirationDate);
    const today = new Date();

    expirationDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return expirationDate < today;
  }

  /**
   * Checks whether the batch belongs to a perishable custom supply.
   *
   * @returns True if the custom supply is perishable; otherwise, false.
   */
  isPerishable(): boolean {
    return this.customSupply?.isPerishable() ?? false;
  }

  /**
   * Validates that the current quantity is not negative.
   *
   * @param quantity Quantity to validate.
   * @throws Error if the quantity is negative.
   */
  private validateCurrentStock(currentStock: Stock): void {
    if (!currentStock) {
      throw new Error('Batch current stock cannot be null.');
    }

    if (currentStock.stock < 0) {
      throw new Error('Batch current quantity cannot be negative.');
    }
  }
}
