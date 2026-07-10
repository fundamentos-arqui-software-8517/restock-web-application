import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { BaseApiEndpoint } from '../../../shared/infrastructure/base-api-endpoint';
import { Profile } from '../../domain/model/profile.entity';
import { ProfileResource, ProfilesListResponse } from './profiles.response';
import { ProfilesAssembler } from './profiles.assembler';
import { profilesApiOrigin, profilesApiFallbackOrigin } from './profiles-api-origin';

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

  /**
   * Backend:
   * GET /api/v1/profiles?accountId={accountId}
   *
   * Response: ProfileResource[] (bare array)
   * Throws HttpErrorResponse(404) when no profile exists for the given account.
   */
  getByAccountId(accountId: string): Observable<Profile> {
    const encodedAccountId = encodeURIComponent(accountId);
    const primaryUrl = `${this.primaryUrl}?accountId=${encodedAccountId}`;
    const fallbackUrl = `${this.fallbackUrl}?accountId=${encodedAccountId}`;

    const parse = (response: unknown): Profile => {
      // The backend returns a single object, not an array.
      // Guard for both shapes in case the API ever changes.
      if (Array.isArray(response)) {
        const list = response as ProfileResource[];
        if (!list.length) {
          throw new HttpErrorResponse({ status: 404, statusText: 'Not Found' });
        }
        return this.assembler.toEntityFromResource(list[0]);
      }

      // Single-object response (current backend contract)
      const resource = response as ProfileResource;
      if (!resource?.id) {
        throw new HttpErrorResponse({ status: 404, statusText: 'Not Found' });
      }
      return this.assembler.toEntityFromResource(resource);
    };

    return this.http.get<unknown>(primaryUrl).pipe(
      map(parse),
      catchError((primaryErr) => {
        if (primaryErr instanceof HttpErrorResponse && primaryErr.status === 404) {
          return throwError(() => primaryErr);
        }
        return this.http.get<unknown>(fallbackUrl).pipe(map(parse));
      }),
    ) as Observable<Profile>;
  }

  override getById(id: string): Observable<Profile> {
    return super.getById(id).pipe(
      catchError(() => this.withFallback(() => super.getById(id))),
      catchError(this.handleError('Failed to get profile by ID')),
    );
  }

  override create(entity: Profile): Observable<Profile> {
    return this.createWithImage(entity);
  }

  override update(entity: Profile, id: string): Observable<Profile> {
    return this.updateWithImage(entity, id);
  }

  createWithImage(entity: Profile, imageFile?: File): Observable<Profile> {
    const fd = buildProfileFormData(
      this.assembler.toResourceFromEntity(entity),
      imageFile
    );

    const operation = () =>
      this.http.post<ProfileResource>(this.endpointUrl, fd).pipe(
        map((created) => this.assembler.toEntityFromResource(created)),
      );

    return operation().pipe(
      catchError(() => this.withFallback(operation)),
      catchError(this.handleError('Failed to create profile')),
    );
  }

  updateWithImage(entity: Profile, id: string, imageFile?: File): Observable<Profile> {
    const fd = buildProfileFormData(
      this.assembler.toResourceFromEntity(entity),
      imageFile
    );

    return this.http.patch<ProfileResource>(
      `${this.primaryUrl}/${encodeURIComponent(id)}`,
      fd
    ).pipe(
      map((updated) => this.assembler.toEntityFromResource(updated)),
      catchError(() =>
        this.http.patch<ProfileResource>(
          `${this.fallbackUrl}/${encodeURIComponent(id)}`,
          fd
        ).pipe(
          map((updated) => this.assembler.toEntityFromResource(updated)),
        )
      ),
      catchError(this.handleError('Failed to update profile')),
    );
  }

  private withFallback<T>(operation: () => Observable<T>): Observable<T> {
    const savedUrl = this.endpointUrl;
    this.endpointUrl = this.fallbackUrl;
    const result$ = operation();
    this.endpointUrl = savedUrl;

    return result$;
  }
}

function buildProfileFormData(resource: ProfileResource, imageFile?: File): FormData {
  const fd = new FormData();

  // Always send all fields — use null-coalescing to ensure empty strings are sent,
  // so the backend can clear fields the user deliberately left blank.
  fd.append('name', resource.name ?? '');
  fd.append('lastName', resource.lastName ?? '');
  fd.append('phoneNumber', resource.phoneNumber ?? '');
  fd.append('gender', resource.gender ?? '');
  fd.append('birthDate', resource.birthDate ?? '');
  if (resource.accountId) fd.append('accountId', resource.accountId);
  if (resource.userId) fd.append('userId', resource.userId);
  if (imageFile) fd.append('image', imageFile);

  return fd;
}