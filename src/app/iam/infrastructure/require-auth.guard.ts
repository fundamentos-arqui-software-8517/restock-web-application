import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { IamStore } from '../application/iam.store';

/**
 * Blocks unauthenticated access to application routes.
 */
export const requireAuthGuard: CanActivateFn = () => {
  const iamStore = inject(IamStore);
  const router = inject(Router);

  return iamStore.isAuthenticated() ? true : router.parseUrl('/sign-in');
};
