/**
 * HTTP request payload for device registration operations.
 *
 * @remarks
 * This interface is used internally in the assembler of this same command.
 */
export interface RegisterDeviceRequest {

  /**
   * The identifier of the account that tries to register a new device into its account.
   */
  accountId: string;

  /**
   * The token used for secure registration of the device.
   */
  registrationToken: string;

  /**
   * An alias the user gives to the device.
   */
  alias: string;
}
