import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
const productApiUrl = `${environment.platformProviderKitApiBaseUrl}/${environment.platformProviderProductsEndpointPath}`;


@Injectable({ providedIn: 'root' })
export class ProductsApiEndpoint {
  private readonly http = inject(HttpClient);

  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(productApiUrl);
  }
}
