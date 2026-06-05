import { BaseEntity } from '../../../../shared/domain/model/base-entity';
import { KitItem } from './kit-item.entity';

export type KitStatus = 'ACTIVE' | 'RESTOCK' | 'LOW_STOCK';

/**
 * Aggregate root for Kit configuration and inventory grouping.
 */
export class Kit implements BaseEntity {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _sku: string;
  private readonly _price: number;
  private readonly _description: string;
  private readonly _imageUrl: string;
  private readonly _status: KitStatus;
  private readonly _items: KitItem[];

  /**
   * Initializes a new Kit instance.
   * @param params - Kit initialization parameters.
   */
  constructor(params: {
    id: string;
    name: string;
    sku: string;
    price: number;
    description: string;
    imageUrl: string;
    status: KitStatus;
    items?: KitItem[];
  }) {
    this._id = params.id;
    this._name = params.name;
    this._sku = params.sku;
    this._price = params.price;
    this._description = params.description;
    this._imageUrl = params.imageUrl;
    this._status = params.status;
    this._items = params.items || [];
  }

  get id(): string {
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

  get description(): string {
    return this._description;
  }

  get imageUrl(): string {
    return this._imageUrl;
  }

  get status(): KitStatus {
    return this._status;
  }

  get items(): KitItem[] {
    return [...this._items];
  }

  /**
   * Indicates whether the kit currently needs an urgent restock.
   */
  get requiresRestock(): boolean {
    return this._status === 'RESTOCK';
  }

  /**
   * Indicates whether the kit stock level is currently critical.
   */
  get isLowStock(): boolean {
    return this._status === 'LOW_STOCK';
  }
}
