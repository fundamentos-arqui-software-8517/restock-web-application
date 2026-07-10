import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { IamSessionService } from '../application/iam-session.service';

/**
 * Redirects authenticated users away from sign-in / sign-up / forgot-password.
 */
export const guestOnlyGuard: CanActivateFn = () => {
  const session = inject(IamSessionService);
  const router = inject(Router);

  return session.isAuthenticated() ? router.parseUrl('/home') : true;
};
