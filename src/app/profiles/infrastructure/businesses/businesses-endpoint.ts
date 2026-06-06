import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { BaseApiEndpoint } from '../../../shared/infrastructure/base-api-endpoint';
import { Business } from '../../domain/model/business.entity';
import { BusinessResource, BusinessesListResponse } from './businesses.response';
import { BusinessesAssembler } from './businesses.assembler';
import { profilesApiOrigin, profilesApiFallbackOrigin } from '../profiles/profiles-api-origin';

/**
 * HTTP client for the `businesses` collection within the profiles bounded context.
 * Instantiated by {@link ProfilesApi}.
 */
export class BusinessesApiEndpoint extends BaseApiEndpoint<
  Business,
  BusinessResource,
  BusinessesListResponse,
  BusinessesAssembler
> {
  private readonly primaryUrl: string;
  private readonly fallbackUrl: string;

  constructor(http: HttpClient) {
    const primary = `${profilesApiOrigin()}/businesses`;
    super(http, primary, new BusinessesAssembler());
    this.primaryUrl = primary;
    this.fallbackUrl = `${profilesApiFallbackOrigin()}/businesses`;
  }

  override getAll(): Observable<Business[]> {
    return super.getAll().pipe(catchError(() => this.withFallback(() => super.getAll())));
  }

  override getById(id: string): Observable<Business> {
    return super.getById(id).pipe(catchError(() => this.withFallback(() => super.getById(id))));
  }

  override create(entity: Business): Observable<Business> {
    return super.create(entity).pipe(catchError(() => this.withFallback(() => super.create(entity))));
  }

  override update(entity: Business, id: string): Observable<Business> {
    return super.update(entity, id).pipe(catchError(() => this.withFallback(() => super.update(entity, id))));
  }

  // Swaps endpointUrl to fallback before calling the operation (the URL is captured
  // synchronously by http.get/post/put), then restores it immediately after.
  private withFallback<T>(operation: () => Observable<T>): Observable<T> {
    this.endpointUrl = this.fallbackUrl;
    const result$ = operation();
    this.endpointUrl = this.primaryUrl;
    return result$;
  }
}

