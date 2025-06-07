import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service'; // Adjust path if needed

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  private authSubscription: Subscription | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Optional: Redirect if already logged in
    this.authSubscription = this.authService.loggedIn$.subscribe(loggedIn => {
      if (loggedIn) {
        this.router.navigate(['/']); // Navigate to home or dashboard
      }
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    const credentials = this.loginForm.value;

    try {
      const { error, user } = await this.authService.signInWithPassword(credentials);
      if (error) {
        // Amplify errors often have a 'name' property that can be more specific
        this.errorMessage = error.message || 'Login failed. Please check your credentials.';
        if (error.name === 'UserNotConfirmedException') {
          this.errorMessage = 'User is not confirmed. Please check your email for a confirmation link or code.';
          // Optionally, navigate to a confirmation page:
          // this.router.navigate(['/auth/confirm-signup'], { queryParams: { username: credentials.email } });
        }
      } else if (user) {
        // Navigation is handled by the ngOnInit subscription if successful
        // this.router.navigate(['/']); // Or specific dashboard
      } else {
        // Handle cases where there's no user but no explicit error (should be rare with Amplify v6)
         this.errorMessage = 'Login failed. Please try again.';
      }
    } catch (err: any) {
      this.errorMessage = err.message || 'An unexpected error occurred during login.';
      console.error('Login error:', err);
    } finally {
      this.isLoading = false;
    }
  }

  async signInWithGoogle(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = null;
    try {
      await this.authService.signInWithGoogle();
      // Redirect will happen, so no explicit navigation here.
      // Errors during the redirect process will be caught by the Hub listener or on the callback page.
    } catch (error: any) {
      this.errorMessage = error.message || 'Google Sign-In failed.';
      console.error('Google Sign-In initiation error:', error);
      this.isLoading = false;
    }
    // isLoading might remain true if redirect is successful, which is fine as the component will be left.
  }
}
