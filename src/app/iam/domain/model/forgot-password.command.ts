/**
 * Command used to request a password reset in the IAM bounded context.
 */
export class ForgotPasswordCommand {
  private readonly _email: string;

  /**
   * Initializes a new ForgotPasswordCommand.
   * @param params - Command payload for password recovery.
   */
  constructor(params: { email: string }) {
    this._email = params.email;
  }

  get email(): string {
    return this._email;
  }
}
