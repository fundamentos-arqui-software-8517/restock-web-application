import { inject } from '@angular/core';
import { HttpEvent, HttpHandlerFn, HttpRequest, HttpInterceptorFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IamSessionService } from '../application/iam-session.service';

/**
 * HTTP interceptor that attaches authorization headers for IAM-protected requests.
 */
export const iamInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const session = inject(IamSessionService);
  const token = session.token();

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
