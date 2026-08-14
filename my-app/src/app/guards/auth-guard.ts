import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn & CanActivateChildFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('authToken');
  console.log('fire...');
  if (token) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};
