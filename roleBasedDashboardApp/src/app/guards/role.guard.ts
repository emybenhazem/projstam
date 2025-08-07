

import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const RoleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const expectedRoles = route.data['expectedRoles'] as string[];

  const userRole = authService.getRoleFromToken(); // ✅ Même fonction utilisée partout

  console.log('🧩 Rôle extrait dans Guard :', userRole);
  console.log('🎯 Rôles attendus :', expectedRoles);

  if (userRole && (userRole === 'admin' || expectedRoles.includes(userRole))) {
    return true;
  }

  router.navigate(['/unauthorized']);
  return false;
};
