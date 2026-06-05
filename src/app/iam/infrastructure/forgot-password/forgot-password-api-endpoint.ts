import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ForgotPasswordAssembler } from './forgot-password.assembler';
import { ForgotPasswordCommand } from '../../domain/model/forgot-password.command';
import { ForgotPasswordRequest } from './forgot-password.request';
import { ForgotPasswordResponse } from './forgot-password.response';

const forgotPasswordApiUrl = `${environment.platformProviderIamApiBaseUrlForSignIn}/${environment.platformProviderForgotPasswordEndpointPath}`;

/**
 * Endpoint for IAM forgot password requests.
 */
@Injectable({ providedIn: 'root' })
export class ForgotPasswordApiEndpoint {
  constructor(private readonly http: HttpClient) {}

  /**
   * Requests a password recovery link.
   * @param command - The forgot password command containing the user email.
   * @returns An observable that completes when the request is processed.
   */
  forgotPassword(command: ForgotPasswordCommand): Observable<void> {
    const request: ForgotPasswordRequest = ForgotPasswordAssembler.toRequestFromCommand(command);

    return this.http.post<ForgotPasswordResponse>(forgotPasswordApiUrl, request).pipe(
      map(() => undefined),
    );
  }
}
