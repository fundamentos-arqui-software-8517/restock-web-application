import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { Kit } from '../../../domain/model/kit.entity';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { ErrorHandlingEnabledBaseType } from '../../../../../shared/infrastructure/error-handling-enabled-base-type';
import { UpdateKitCommand } from '../../../domain/command/update-kit.command';
import { KitsRequest } from '../kits.request';
import { KitResponse } from '../kits.response';
import { KitAssembler } from '../kits.assembler';

const kitsApiUrl = `${environment.platformProviderKitUpdateApiBaseUrl}/${environment.platformProviderKitsEndpointPath}`;

/**
 * Infrastructure endpoint adapter for specialized Kit updating HTTP operations.
 */
@Injectable({
  providedIn: 'root',
})
export class UpdateKitApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Updates an existing kit contract setup based on its unique domain ID.
   */
  updateKit(command: UpdateKitCommand): Observable<Kit> {
    const updateUrl = `${kitsApiUrl}/${command.id}`;
    const request: KitsRequest = {
      name: command.name,
      price: command.price,
      description: command.description,
      imageUrl: command.imageUrl,
      items: command.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };
    return this.http.put<KitResponse>(updateUrl, request).pipe(
      map((response) => KitAssembler.toEntityFromResponse(response)),
      catchError(this.handleError('Failed to update explicit kit setup.')),
    );
  }
}
