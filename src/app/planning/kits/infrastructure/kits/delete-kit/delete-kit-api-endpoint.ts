import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { ErrorHandlingEnabledBaseType } from '../../../../../shared/infrastructure/error-handling-enabled-base-type';
import { DeleteKitCommand } from '../../../domain/command/delete-kit.command';
import { DeleteKitAssembler } from './delete-kit.assembler';

const kitsApiUrl = `${environment.platformProviderApiBaseUrl}/${environment.platformProviderProductsEndpointPath}`;

@Injectable({
  providedIn: 'root',
})
export class DeleteKitApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(private http: HttpClient) {
    super();
  }

  deleteKit(command: DeleteKitCommand): Observable<void> {
    const productId = DeleteKitAssembler.toPathParams(command);
    const url = `${kitsApiUrl}/${productId}`;
    return this.http
      .delete<void>(url)
      .pipe(catchError(this.handleError('Error al eliminar el kit.')));
  }
}
