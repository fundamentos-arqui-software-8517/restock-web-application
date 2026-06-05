import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { Kit } from '../../../domain/model/kit.entity';
import { RegisterKitResponse } from './register-kit.response';
import { RegisterKitAssembler } from './register-kit.assembler';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { ErrorHandlingEnabledBaseType } from '../../../../../shared/infrastructure/error-handling-enabled-base-type';
import { RegisterKitCommand } from '../../../domain/command/register-kit.command';

const kitsApiUrl = `${environment.platformProviderKitApiBaseUrl}/${environment.platformProviderKitsRegisterEndpointPath}`;

/**
 * Infrastructure endpoint adapter for specialized Kit registration HTTP operations.
 */
@Injectable({
  providedIn: 'root',
})
export class RegisterKitApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Registers a new kit configuration in the remote Restock API platform.
   */
  registerKit(command: RegisterKitCommand): Observable<Kit> {
    const request = RegisterKitAssembler.toRequestFromCommand(command);
    return this.http.post<RegisterKitResponse>(kitsApiUrl, request).pipe(
      map((response) => RegisterKitAssembler.toEntityFromResponse(response)),
      catchError(this.handleError('Failed to register the new kit configuration.')),
    );
  }
}
