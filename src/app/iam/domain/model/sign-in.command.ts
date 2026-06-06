/**
 * Command used to authenticate a user in the IAM bounded context.
 */
export class SignInCommand {
  private readonly _email: string;
  private readonly _password: string;

  /**
   * Initializes a new SignInCommand.
   * @param params - Command payload for sign-in.
   */
  constructor(params: { email: string; password: string }) {
    this._email = params.email;
    this._password = params.password;
  }

  get email(): string {
    return this._email;
  }
  get password(): string {
    return this._password;
  }
}
