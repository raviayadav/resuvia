import { inject } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service'; // Adjust path if needed

// Define the base URL of your FastAPI backend
// Requests to this URL (and its subpaths) will have the token attached.
const backendApiUrl = 'YOUR_FASTAPI_BACKEND_URL'; // <-- IMPORTANT: Replace with your actual backend URL

export const authInterceptorFn: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService); // Inject AuthService here

  // Only intercept requests going to your backend API
  if (req.url.startsWith(backendApiUrl)) {
    // Use `from` to convert the Promise from getAccessToken into an Observable
    return from(authService.getAccessToken()).pipe(
      switchMap(token => {
        if (token) {
          // Clone the request and add the authorization header
          const clonedReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
          return next(clonedReq); // Pass cloned request to the next handler
        } else {
          // If no token, proceed with the original request
          return next(req); // Pass original request to the next handler
        }
      })
    );
  } else {
    // For other requests, pass them through without modification
    return next(req); // Pass original request to the next handler
  }
};
