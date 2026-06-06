import { PhoneNumber } from './phone-number';

export class UpdateProfileCommand {
  private readonly _profileId: string;
  private readonly _userId: string;
  private readonly _name: string;
  private readonly _lastName: string;
  private readonly _phoneNumber: PhoneNumber;
  private readonly _avatarUrl: string;
  private readonly _gender: string;
  private readonly _birthDate: string;

  /**
   * @param resource - Field snapshot to send to the update endpoint.
   */
  constructor(resource: {
    profileId: string;
    userId: string;
    name: string;
    lastName: string;
    phoneNumber: string;
    avatarUrl: string;
    gender: string;
    birthDate: string;
  }) {
    this._profileId = resource.profileId;
    this._userId = resource.userId;
    this._name = resource.name;
    this._lastName = resource.lastName;
    this._phoneNumber = new PhoneNumber(resource.phoneNumber);
    this._avatarUrl = resource.avatarUrl;
    this._gender = resource.gender;
    this._birthDate = resource.birthDate;
  }

  /** Document id of the profile (string). */
  get profileId(): string {
    return this._profileId;
  }

  /** Owning user id. */
  get userId(): string {
    return this._userId;
  }

  /** First / given name. */
  get name(): string {
    return this._name;
  }

  /** Family name. */
  get lastName(): string {
    return this._lastName;
  }

  /** Phone as value object. */
  get phoneNumber(): PhoneNumber {
    return this._phoneNumber;
  }

  get avatarUrl(): string {
    return this._avatarUrl;
  }

  get gender(): string {
    return this._gender;
  }

  /** ISO or API date string for birth date. */
  get birthDate(): string {
    return this._birthDate;
  }
}
