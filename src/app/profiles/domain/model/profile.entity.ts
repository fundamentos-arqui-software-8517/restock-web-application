import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { UserId } from '../../../shared/domain/model/valueobjects/user-id';
import { DateTime } from '../../../shared/domain/model/valueobjects/date-time';
import { ImageUrl } from '../../../shared/domain/model/valueobjects/image-url';
import { ProfileId } from './profile-id';
import { PhoneNumber } from './phone-number';


export class Profile implements BaseEntity {
  private _profileId: ProfileId;
  private _userId: UserId;
  private _name: string;
  private _lastName: string;
  private _phoneNumber: PhoneNumber;
  private _avatarUrl: ImageUrl;
  private _gender: string;
  private _birthDate: DateTime;

  /**
   * @param init - Field bundle matching persistence and class diagram.
   */
  constructor(init: {
    profileId: string;
    userId: string;
    name: string;
    lastName: string;
    phoneNumber: string;
    avatarUrl: string;
    gender: string;
    birthDate: string;
  }) {
    this._profileId = new ProfileId(init.profileId);
    this._userId = new UserId(init.userId);
    this._name = init.name;
    this._lastName = init.lastName;
    this._phoneNumber = new PhoneNumber(init.phoneNumber);
    this._avatarUrl = new ImageUrl(init.avatarUrl);
    this._gender = init.gender;
    this._birthDate = new DateTime(init.birthDate);
  }

  /**
   * Alias for {@link ProfileId} so the entity satisfies {@link BaseEntity}.
   */
  get id(): string {
    return this._profileId.getValue();
  }

  get profileId(): ProfileId {
    return this._profileId;
  }

  get userId(): UserId {
    return this._userId;
  }

  get name(): string {
    return this._name;
  }

  get lastName(): string {
    return this._lastName;
  }

  get phoneNumber(): PhoneNumber {
    return this._phoneNumber;
  }

  get avatarUrl(): ImageUrl {
    return this._avatarUrl;
  }

  get gender(): string {
    return this._gender;
  }

  get birthDate(): DateTime {
    return this._birthDate;
  }

  /**
   * Change contact phone .
   */
  edit(phoneNumber: PhoneNumber): void {
    this._phoneNumber = phoneNumber;
  }

  /**
   * Replace avatar image URL.
   */
  updateAvatarUrl(avatarUrl: ImageUrl): void {
    this._avatarUrl = avatarUrl;
  }
}
