import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents an item in a sale.
 */
export class SaleItem implements BaseEntity {

  /**
   * The unique identifier of the item.
   * @private Id is stored as a string to allow for flexibility in naming conventions.
   */
  private _id: string;

  /**
   * The name of the item.
   * @private Name is stored as a string to allow for flexibility in naming conventions.
   */
  private _nameSnapshot: string;

  /**
   * The unit price of the item.
   * @private Unit price is stored as a number to allow for decimal prices.
   */
  private _unitPrice: number;

  /**
   * The quantity of the item.
   * @private Quantity is stored as a number to allow for decimal quantities.
   */
  private _quantity: number;

  /**
   * The line total of the item.
   * @private Line total is stored as a number to allow for decimal quantities.
   */
  private _lineTotal: number;

  private _imageUrl: string | undefined;

  /**
   * Create a SaleItem
   * @param SaleItem - An object containing the item's id, name, unit price, quantity, and line total.
   */
  constructor(SaleItem: {
    id: string;
    nameSnapshot: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
    imageUrl?: string;
  }) {
    this._id = SaleItem.id;
    this._nameSnapshot = SaleItem.nameSnapshot;
    this._unitPrice = SaleItem.unitPrice;
    this._quantity = SaleItem.quantity;
    this._lineTotal = SaleItem.lineTotal;
    this._imageUrl = SaleItem.imageUrl;
  }

  /**
   * Getter for the item's id.
   * @returns The item's id.
   */
  get id(): string {
    return this._id;
  }

  /**
   * Getter for the item's name.
   * @returns The item's name.
   */
  get nameSnapshot(): string {
    return this._nameSnapshot;
  }

  /**
   * Getter for the item's unit price.
   * @returns The item's unit price.
   */
  get unitPrice(): number {
    return this._unitPrice;
  }

  /**
   * Getter for the item's quantity.
   * @returns The item's quantity.
   */
  get quantity(): number {
    return this._quantity;
  }

  /**
   * Getter for the item's line total.
   * @returns The item's line total.
   */
  get lineTotal(): number {
    return this._lineTotal * this._quantity;
  }

  get imageUrl(): string | undefined {
    return this._imageUrl;
  }
}
