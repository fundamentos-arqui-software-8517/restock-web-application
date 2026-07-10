import { inject } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import { AlertService } from '../application/alert.service';
import { userErrorDescriptor } from './user-error-message';

export const httpAlertInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const alerts = inject(AlertService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && shouldNotify(req, error)) {
        const friendlyError = userErrorDescriptor(error);
        alerts.errorKey(friendlyError.key, friendlyError.params);
      }

      return throwError(() => error);
    }),
  );
};

function shouldNotify(req: HttpRequest<unknown>, error: HttpErrorResponse): boolean {
  if (req.url.includes('/i18n/') || req.url.endsWith('.json')) return false;
  if (error.status === 0 || error.status === 401) return false;
  if (req.method === 'GET' && error.status < 500) return false;
  return error.status >= 400;
}
