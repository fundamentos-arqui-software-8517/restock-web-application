import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { IamRegisteredUsersStorage } from '../iam-registered-users.storage';
import { environment } from '../../../../environments/environment';
import { SignUpCommand } from '../../domain/model/sign-up.command';
import { SignUpRequest } from './sign-up.request';
import { SignUpResponse } from './sign-up.response';
const signUpApiUrl = `${environment.platformProviderApiBaseUrl}/${environment.platformProviderSignUpEndpointPath}`;

/**
 * Endpoint for IAM sign-up requests.
 */
@Injectable({ providedIn: 'root' })
export class SignUpApiEndpoint {
  private readonly registeredUsers = inject(IamRegisteredUsersStorage);

  constructor(private readonly http: HttpClient) {}

  signUp(command: SignUpCommand): Observable<SignUpResponse> {
    const request: SignUpRequest = {
      businessName: command.businessName,
      email: command.email,
      password: command.password ?? '',
      role: command.role ?? '',
    };

    return this.http.post<SignUpResponse>(signUpApiUrl, request).pipe(
      catchError((error) => throwError(() => error)),
    );
  }
}
