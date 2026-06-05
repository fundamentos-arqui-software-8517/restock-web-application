import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { UserId } from '../../../shared/domain/model/valueobjects/user-id';
import { BusinessId } from '../../../shared/domain/model/valueobjects/business-id';
import { ImageUrl } from '../../../shared/domain/model/valueobjects/image-url';
import { Address } from '../../../shared/domain/model/valueobjects/address';

export class Business implements BaseEntity {
  private _businessId: BusinessId;
  private _companyName: string;
  private _ruc: string;
  private _pictureUrl: ImageUrl;
  private _mainLocation: Address;
  private _ownerId: UserId;

  /**
   * @param init - Field bundle aligned with `businesses` schema.
   */
  constructor(init: {
    businessId: string;
    companyName: string;
    ruc: string;
    pictureUrl: string;
    mainLocation: string;
    ownerId: string;
  }) {
    this._businessId = new BusinessId(init.businessId);
    this._companyName = init.companyName;
    this._ruc = init.ruc;
    this._pictureUrl = new ImageUrl(init.pictureUrl);
    this._mainLocation = new Address(init.mainLocation);
    this._ownerId = new UserId(init.ownerId);
  }

  /**
   * Exposes document id for {@link BaseEntity} consumers (HTTP routes, lists).
   */
  get id(): string {
    return this._businessId.getValue();
  }

  get businessId(): BusinessId {
    return this._businessId;
  }

  get companyName(): string {
    return this._companyName;
  }

  get ruc(): string {
    return this._ruc;
  }

  get pictureUrl(): ImageUrl {
    return this._pictureUrl;
  }

  get mainLocation(): Address {
    return this._mainLocation;
  }

  get ownerId(): UserId {
    return this._ownerId;
  }

  /**
   * Update primary address from validated input.
   */
  edit(mainLocation: Address): void {
    this._mainLocation = mainLocation;
  }

  /**
   * Replace business image URL.
   */
  updatePictureUrl(pictureUrl: ImageUrl): void {
    this._pictureUrl = pictureUrl;
  }
}
