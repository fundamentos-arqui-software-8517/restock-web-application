import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AddKitItemAssembler } from './add-kit-item.assembler';
import { environment } from '../../../../../../environments/environment';
import { ErrorHandlingEnabledBaseType } from '../../../../../shared/infrastructure/error-handling-enabled-base-type';
import { AddKitItemCommand } from '../../../domain/command/add-kit-item.command';
import { KitEntity } from '../../../domain/model/kit.entity';
import { UpdateKitResponse } from '../update-kit/update-kit.response';
import { UpdateKitAssembler } from '../update-kit/update-kit.assembler';

const kitsApiUrl = `${environment.platformProviderApiBaseUrl}/${environment.platformProviderProductsEndpointPath}`;

@Injectable({
  providedIn: 'root',
})
export class AddKitItemApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(private http: HttpClient) {
    super();
  }
  addKitItem(productId: string, command: AddKitItemCommand): Observable<KitEntity> {
    const url = `${kitsApiUrl}/${productId}/ingredients`;
    const request = AddKitItemAssembler.toRequestFromCommand(command);

    return this.http.post<UpdateKitResponse>(url, request).pipe(
      map((response) => UpdateKitAssembler.toEntityFromResponse(response)),
      catchError(this.handleError('Error agregando ingrediente')),
    );
  }
}
