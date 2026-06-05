/**
 * Command used to register a new user in the IAM bounded context.
 */
export class SignUpCommand {
  private readonly _email: string;
  private readonly _password?: string;
  private readonly _role?: string;
  private readonly _businessName?: string;
  private readonly _phone?: string;
  private readonly _country?: string;

  /**
   * Initializes a new SignUpCommand.
   * @param params - Command payload for sign-up.
   */
  constructor(params: {
    email: string;
    password?: string;
    role?: string;
    businessName?: string;
    phone?: string;
    country?: string;
  }) {
    this._email = params.email;
    this._password = params.password;
    this._role = params.role;
    this._businessName = params.businessName;
    this._phone = params.phone;
    this._country = params.country;
  }

  get email(): string {
    return this._email;
  }

  get password(): string | undefined {
    return this._password;
  }

  get role(): string | undefined {
    return this._role;
  }

  get businessName(): string | undefined {
    return this._businessName;
  }

  get phone(): string | undefined {
    return this._phone;
  }

  get country(): string | undefined {
    return this._country;
  }
}
