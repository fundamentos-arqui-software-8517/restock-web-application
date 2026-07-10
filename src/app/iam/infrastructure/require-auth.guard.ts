import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { IamSessionService } from '../application/iam-session.service';

/**
 * Blocks unauthenticated access to application routes.
 */
export const requireAuthGuard: CanActivateFn = () => {
  const session = inject(IamSessionService);
  const router = inject(Router);

  return session.isAuthenticated() ? true : router.parseUrl('/sign-in');
};
