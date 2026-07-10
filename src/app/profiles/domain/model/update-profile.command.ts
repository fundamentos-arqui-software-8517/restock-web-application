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
  readonly imageFile?: File;

  constructor(resource: {
    profileId: string;
    userId: string;
    name: string;
    lastName: string;
    phoneNumber: string;
    avatarUrl: string;
    gender: string;
    birthDate: string;
    imageFile?: File;
  }) {
    this._profileId = resource.profileId;
    this._userId = resource.userId;
    this._name = resource.name;
    this._lastName = resource.lastName;
    this._phoneNumber = new PhoneNumber(resource.phoneNumber);
    this._avatarUrl = resource.avatarUrl;
    this._gender = resource.gender;
    this._birthDate = resource.birthDate;
    this.imageFile = resource.imageFile;
  }

  get profileId(): string { return this._profileId; }
  get userId(): string { return this._userId; }
  get name(): string { return this._name; }
  get lastName(): string { return this._lastName; }
  get phoneNumber(): PhoneNumber { return this._phoneNumber; }
  get avatarUrl(): string { return this._avatarUrl; }
  get gender(): string { return this._gender; }
  get birthDate(): string { return this._birthDate; }
}
