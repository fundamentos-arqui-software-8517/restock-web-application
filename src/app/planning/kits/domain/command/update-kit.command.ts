/**
 * Command used to update an existing kit in the inventory bounded context.
 */
export class UpdateKitCommand {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _price: number;
  private readonly _description: string;
  private readonly _imageUrl: string;
  private readonly _items: Array<{ productId: string; quantity: number }>;

  /**
   * Initializes a new UpdateKitCommand.
   * @param params - Command payload for updating a kit.
   */
  constructor(params: {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    items: Array<{ productId: string; quantity: number }>;
  }) {
    this._id = params.id;
    this._name = params.name;
    this._price = params.price;
    this._description = params.description;
    this._imageUrl = params.imageUrl;
    this._items = params.items;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
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

  get items(): Array<{ productId: string; quantity: number }> {
    return this._items;
  }
}
