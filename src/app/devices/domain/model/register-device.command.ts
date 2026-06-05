/**
 * Domain command encapsulating device registration information.
 *
 * @remarks
 * RegisterDeviceCommand captures the account intent to register a new device.
 *
 * This command:
 * - Holds the account identifier that wants to register a new device.
 * - Holds a security token for validating in the system.
 * - Is transformed by the infrastructure layer for API communication.
 */
export class RegisterDeviceCommand {

  /**
   * The account backing field indicating the account that wants to register a new device.
   * @private
   */
  private _accountId: string;

  /**
   * The token used for secure registration of the device.
   * @private
   */
  private _registrationToken: string;

  /**
   * An alias the user gives to the device
   * @private
   */
  private _alias: string;

  /**
   * Creates a new RegisterDeviceCommand instance.
   *
   * @param props - Values for the device registration.
   * @param props.accountId - The account identifier.
   * @param props.registrationToken - The registration token.
   * @param props.alias - The alias given to the device.
   */
  constructor(props: {
    accountId: string,
    registrationToken: string,
    alias: string
  }) {
    this._accountId = props.accountId;
    this._registrationToken = props.registrationToken;
    this._alias = props.alias;
  }

  /**
   * Gets the current account id value for device registration.
   *
   * @returns The account id value.
   */
  get accountId(): string {
    return this._accountId;
  }

  /**
   * Gets the registration token value.
   *
   * @returns The registration token value.
   */
  get registrationToken(): string {
    return this._registrationToken;
  }

  /**
   * Sets a new value for the registrationToken property.
   *
   * @param value - The new value for the registrationToken property.
   */
  set registrationToken(value: string) {
    this._registrationToken = value;
  }

  /**
   * Gets the alias value for this command.
   *
   * @returns The alias value.
   */
  get alias(): string {
    return this._alias;
  }

  /**
   * Sets a new value for the alias property.
   *
   * @param value - The new value for the alias property.
   */
  set alias(value: string) {
    this._alias = value;
  }
}
