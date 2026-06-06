import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { KitEntity } from '../../../domain/model/kit.entity';
import { UpdateKitResponse } from './update-kit.response';
import { UpdateKitAssembler } from './update-kit.assembler';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { ErrorHandlingEnabledBaseType } from '../../../../../shared/infrastructure/error-handling-enabled-base-type';
import { UpdateKitCommand } from '../../../domain/command/update-kit.command';

const kitsApiUrl = `${environment.platformProviderApiBaseUrl}/${environment.platformProviderProductsEndpointPath}`;

@Injectable({
  providedIn: 'root',
})
export class UpdateKitApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(private http: HttpClient) {
    super();
  }

  updateKit(command: UpdateKitCommand): Observable<KitEntity> {
    const updateUrl = `${kitsApiUrl}/${command.id}`;
    const request = UpdateKitAssembler.toRequestFromCommand(command);
    return this.http.put<UpdateKitResponse>(updateUrl, request).pipe(
      map((response) => {
        console.log('RAW response:', response);
        return UpdateKitAssembler.toEntityFromResponse(response);
      }),
      catchError((err) => {
        console.error('Status:', err.status);
        console.error('Backend error body:', err.error);
        return this.handleError('Failed to update explicit kit setup.')(err);
      }),
    );
  }
}
