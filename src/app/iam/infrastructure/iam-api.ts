import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { SignUpCommand } from '../domain/model/sign-up.command';
import { SignUpResponse } from './sign-up/sign-up.response';
import { User } from '../domain/model/user.entity';
import { SignUpApiEndpoint } from './sign-up/sign-up-api-endpoint';
import { SignInApiEndpoint } from './sign-in/sign-in-api-endpoint';
import { SignInCommand } from '../domain/model/sign-in.command';
import { ForgotPasswordCommand } from '../domain/model/forgot-password.command';
import { ForgotPasswordApiEndpoint } from './forgot-password/forgot-password-api-endpoint';

/**
 * IamApi
 * Infrastructure API facade for IAM operations.
 */
@Injectable({ providedIn: 'root' })
export class IamApi extends BaseApi {
  constructor(
    private readonly signUpEndpoint: SignUpApiEndpoint,
    private readonly signInEndpoint: SignInApiEndpoint,
    private readonly forgotPasswordEndpoint: ForgotPasswordApiEndpoint,
  ) {
    super();
  }

  /**
   * Registers a new user.
   * @param command - The sign-up command containing user credentials.
   */
  signUp(command: SignUpCommand): Observable<SignUpResponse> {
    return this.signUpEndpoint.signUp(command);
  }

  /**
   * Authenticates an existing user.
   * @param command - The sign-in command containing credentials.
   */
  signIn(command: SignInCommand): Observable<User> {
    return this.signInEndpoint.signIn(command);
  }

  /**
   * Requests a password recovery link.
   * @param command - The forgot password command.
   */
  forgotPassword(command: ForgotPasswordCommand): Observable<void> {
    return this.forgotPasswordEndpoint.forgotPassword(command);
  }
}
