import { BaseEntity } from '../../../../shared/domain/model/base-entity';

/**
 * Entity representing an item/component inside a Kit aggregate.
 * Cloned directly from the service definitions (Beeceptor).
 */
export class KitItem implements BaseEntity {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _sku: string;
  private readonly _price: number;
  private _quantity: number;

  /**
   * Initializes a new KitItem instance from endpoint data.
   */
  constructor(params: { id: string; name: string; sku: string; price: number; quantity: number }) {
    if (params.quantity <= 0) {
      throw new Error('La cantidad del producto debe ser mayor a cero.');
    }

    this._id = params.id;
    this._name = params.name;
    this._sku = params.sku;
    this._price = params.price;
    this._quantity = params.quantity;
  }

  get id(): string {
    return this._id;
  }

  get productId(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get sku(): string {
    return this._sku;
  }

  get price(): number {
    return this._price;
  }

  get quantity(): number {
    return this._quantity;
  }

  changeQuantity(newQuantity: number): void {
    if (newQuantity <= 0) {
      throw new Error('La cantidad del componente debe ser mayor a cero.');
    }
    this._quantity = newQuantity;
  }

  get subtotal(): number {
    return this._price * this._quantity;
  }
}
