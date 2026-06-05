import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { IamStore } from '../application/iam.store';

/**
 * Redirects authenticated users away from sign-in / sign-up / forgot-password.
 */
export const guestOnlyGuard: CanActivateFn = () => {
  const iamStore = inject(IamStore);
  const router = inject(Router);

  return iamStore.isAuthenticated() ? router.parseUrl('/home') : true;
};
