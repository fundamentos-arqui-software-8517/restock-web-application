import { Address } from '../../../shared/domain/model/valueobjects/address';
import { ImageUrl } from '../../../shared/domain/model/valueobjects/image-url';

export class UpdateBusinessCommand {
  private readonly _businessId: string;
  private readonly _mainLocation: Address;
  private readonly _pictureUrl: ImageUrl;

  /**
   * @param resource - Identifiers and value objects for the update payload.
   */
  constructor(resource: { businessId: string; mainLocation: string; pictureUrl: string }) {
    this._businessId = resource.businessId;
    this._mainLocation = new Address(resource.mainLocation);
    this._pictureUrl = new ImageUrl(resource.pictureUrl);
  }

  get businessId(): string {
    return this._businessId;
  }

  get mainLocation(): Address {
    return this._mainLocation;
  }

  get pictureUrl(): ImageUrl {
    return this._pictureUrl;
  }
}
