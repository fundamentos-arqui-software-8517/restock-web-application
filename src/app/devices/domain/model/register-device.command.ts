export class RegisterDeviceCommand {
  private _accountId: string;
  private _macAddress: string;
  private _description: string;

  constructor(props: { accountId: string; macAddress: string; description: string }) {
    this._accountId = props.accountId;
    this._macAddress = props.macAddress;
    this._description = props.description;
  }

  get accountId(): string { return this._accountId; }
  get macAddress(): string { return this._macAddress; }
  get description(): string { return this._description; }
}
