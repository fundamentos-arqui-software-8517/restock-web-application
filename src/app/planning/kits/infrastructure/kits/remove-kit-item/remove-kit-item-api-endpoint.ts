import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { ErrorHandlingEnabledBaseType } from '../../../../../shared/infrastructure/error-handling-enabled-base-type';
import { KitEntity } from '../../../domain/model/kit.entity';
import { UpdateKitResponse } from '../update-kit/update-kit.response';
import { UpdateKitAssembler } from '../update-kit/update-kit.assembler';
import { RemoveKitItemCommand } from '../../../domain/command/remove-kit-item.command';
import { RemoveKitAssembler } from './remove-kit-item.assembler';

const kitsApiUrl = `${environment.platformProviderApiBaseUrl}/${environment.platformProviderProductsEndpointPath}`;

@Injectable({
  providedIn: 'root',
})
export class RemoveKitItemApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(private http: HttpClient) {
    super();
  }

  removeKitItem(command: RemoveKitItemCommand): Observable<KitEntity> {
    const { productId, customSupplyId } = RemoveKitAssembler.toPathParams(command);
    const url = `${kitsApiUrl}/${productId}/ingredients/${customSupplyId}`;

    return this.http.delete<UpdateKitResponse>(url).pipe(
      map((response) => UpdateKitAssembler.toEntityFromResponse(response)),
      catchError(this.handleError('Error al eliminar el ingrediente del kit.')),
    );
  }
}
