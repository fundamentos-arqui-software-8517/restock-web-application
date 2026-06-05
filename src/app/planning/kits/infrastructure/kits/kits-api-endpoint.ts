import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Kit } from '../../domain/model/kit.entity';
import { KitResponse } from './kits.response';
import { KitAssembler } from './kits.assembler';
import { environment } from '../../../../../environments/environment';

const kitsApiUrl = `${environment.platformProviderKitApiBaseUrl}/${environment.platformProviderKitsEndpointPath}`;

/**
 * Infrastructure endpoint adapter focused exclusively on query and read operations for Kits.
 */
@Injectable({ providedIn: 'root' })
export class KitsApiEndpoint {
  private readonly http = inject(HttpClient);

  /**
   * Fetches all registered kits from the catalog.
   * Maps the response array into domain entities for the catalog view.
   */
  getAllKits(): Observable<Kit[]> {
    return this.http
      .get<KitResponse[]>(kitsApiUrl)
      .pipe(
        map((responseArray) =>
          responseArray.map((response) => KitAssembler.toEntityFromResponse(response)),
        ),
      );
  }
}
