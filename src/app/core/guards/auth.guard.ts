import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service'; // Adjust path if needed

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.loggedIn$.pipe(
    take(1), // Take the first emission to avoid ongoing subscription issues in guards
    map(isLoggedIn => {
      if (isLoggedIn) {
        return true; // Allow access if logged in
      } else {
        // Redirect to login page if not logged in
        // Pass the attempted URL as a query parameter for potential redirection after login
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false; // Block access
      }
    })
  );
};
