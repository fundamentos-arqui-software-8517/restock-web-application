import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { BaseApiEndpoint } from '../../../shared/infrastructure/base-api-endpoint';
import { Business } from '../../domain/model/business.entity';
import { BusinessResource, BusinessesListResponse } from './businesses.response';
import { BusinessesAssembler } from './businesses.assembler';
import { profilesApiOrigin, profilesApiFallbackOrigin } from '../profiles/profiles-api-origin';

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

  /**
   * Backend:
   * GET /api/v1/businesses?accountId={accountId}
   *
   * Response: BusinessResource[] (bare array)
   * Throws HttpErrorResponse(404) when no business exists for the given account.
   */
  getByAccountId(accountId: string): Observable<Business> {
    const encodedAccountId = encodeURIComponent(accountId);
    const primaryUrl = `${this.primaryUrl}?accountId=${encodedAccountId}`;
    const fallbackUrl = `${this.fallbackUrl}?accountId=${encodedAccountId}`;

    const parse = (response: unknown): Business => {
      // The backend returns a single object, not an array.
      // Guard for both shapes in case the API ever changes.
      if (Array.isArray(response)) {
        const list = response as BusinessResource[];
        if (!list.length) {
          throw new HttpErrorResponse({ status: 404, statusText: 'Not Found' });
        }
        return this.assembler.toEntityFromResource(list[0]);
      }

      // Single-object response (current backend contract)
      const resource = response as BusinessResource;
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
    ) as Observable<Business>;
  }

  override getById(id: string): Observable<Business> {
    return super.getById(id).pipe(
      catchError(() => this.withFallback(() => super.getById(id))),
      catchError(this.handleError('Failed to get business by ID')),
    );
  }

  override create(entity: Business): Observable<Business> {
    return this.createWithImage(entity);
  }

  override update(entity: Business, id: string): Observable<Business> {
    return this.updateWithImage(entity, id);
  }

  createWithImage(entity: Business, imageFile?: File): Observable<Business> {
    const fd = buildBusinessFormData(
      this.assembler.toResourceFromEntity(entity),
      imageFile
    );

    const operation = () =>
      this.http.post<BusinessResource>(this.endpointUrl, fd).pipe(
        map((created) => this.assembler.toEntityFromResource(created)),
      );

    return operation().pipe(
      catchError(() => this.withFallback(operation)),
      catchError(this.handleError('Failed to create business')),
    );
  }

  updateWithImage(entity: Business, id: string, imageFile?: File): Observable<Business> {
    const fd = buildBusinessFormData(
      this.assembler.toResourceFromEntity(entity),
      imageFile
    );

    return this.http.patch<BusinessResource>(
      `${this.primaryUrl}/${encodeURIComponent(id)}`,
      fd
    ).pipe(
      map((updated) => this.assembler.toEntityFromResource(updated)),
      catchError(() =>
        this.http.patch<BusinessResource>(
          `${this.fallbackUrl}/${encodeURIComponent(id)}`,
          fd
        ).pipe(
          map((updated) => this.assembler.toEntityFromResource(updated)),
        )
      ),
      catchError(this.handleError('Failed to update business')),
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

function buildBusinessFormData(resource: BusinessResource, imageFile?: File): FormData {
  const fd = new FormData();

  fd.append('companyName', resource.companyName ?? '');
  fd.append('ruc', resource.ruc ?? '');
  fd.append('mainLocation', resource.mainLocation ?? '');
  if (resource.accountId) fd.append('accountId', resource.accountId);
  if (resource.userId) fd.append('userId', resource.userId);
  if (imageFile) fd.append('image', imageFile);

  return fd;
}