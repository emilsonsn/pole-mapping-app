import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router} from '@angular/router';
import {SessionQuery} from '@store/session.query';
import {catchError, map, of} from 'rxjs';

export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const router = inject(Router);
  const sessionQuery = inject(SessionQuery);


  return sessionQuery.user$.pipe(
    map(user => {
      return !!user;
    }),
    catchError(error => {
      console.error('Permission check error:', error);
      router.navigate(['/painel/clients']).then();
      return of(false);
    })
  );


};
