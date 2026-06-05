import { inject } from '@angular/core';
import { HttpEvent, HttpHandlerFn, HttpRequest, HttpInterceptorFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IamStore } from '../application/iam.store';

/**
 * HTTP interceptor that attaches authorization headers for IAM-protected requests.
 */
export const iamInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const iamStore = inject(IamStore);
  const currentUser = iamStore.currentUser();
  const token = currentUser?.token;

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq);
};
