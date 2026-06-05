/**
 * Command used to register a new kit in the inventory bounded context.
 */
export class RegisterKitCommand {
  private readonly _name: string;
  private readonly _price: number;
  private readonly _description: string;
  private readonly _imageUrl: string;
  private readonly _items: Array<{ productId: string; quantity: number }>;

  /**
   * Initializes a new RegisterKitCommand.
   * @param params - Command payload for kit registration.
   */
  constructor(params: {
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    items: Array<{ productId: string; quantity: number }>;
  }) {
    this._name = params.name;
    this._price = params.price;
    this._description = params.description;
    this._imageUrl = params.imageUrl;
    this._items = params.items;
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
