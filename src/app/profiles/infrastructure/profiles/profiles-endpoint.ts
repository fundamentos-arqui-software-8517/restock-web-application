import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { BaseApiEndpoint } from '../../../shared/infrastructure/base-api-endpoint';
import { Profile } from '../../domain/model/profile.entity';
import { ProfileResource, ProfilesListResponse } from './profiles.response';
import { ProfilesAssembler } from './profiles.assembler';
import { profilesApiOrigin, profilesApiFallbackOrigin } from './profiles-api-origin';

/**
 * HTTP client for the `profiles` collection (mirrors `sales-endpoint` in the sales context).
 * Instantiated by {@link ProfilesApi}.
 */
export class ProfilesApiEndpoint extends BaseApiEndpoint<
  Profile,
  ProfileResource,
  ProfilesListResponse,
  ProfilesAssembler
> {
  private readonly primaryUrl: string;
  private readonly fallbackUrl: string;

  constructor(http: HttpClient) {
    const primary = `${profilesApiOrigin()}/profiles`;
    super(http, primary, new ProfilesAssembler());
    this.primaryUrl = primary;
    this.fallbackUrl = `${profilesApiFallbackOrigin()}/profiles`;
  }

  override getAll(): Observable<Profile[]> {
    return super.getAll().pipe(catchError(() => this.withFallback(() => super.getAll())));
  }

  override getById(id: string): Observable<Profile> {
    return super.getById(id).pipe(catchError(() => this.withFallback(() => super.getById(id))));
  }

  override create(entity: Profile): Observable<Profile> {
    return super.create(entity).pipe(catchError(() => this.withFallback(() => super.create(entity))));
  }

  override update(entity: Profile, id: string): Observable<Profile> {
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
