import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service'; // Adjust path if needed

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'] // You might reuse login styles or create new ones
})
export class SignupComponent implements OnInit, OnDestroy {
  signupForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  private authSubscription: Subscription | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      // Add password complexity validation if needed
      password: ['', [Validators.required, Validators.minLength(6)]]
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
    if (this.signupForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    const credentials = this.signupForm.value;

    try {
      const result = await this.authService.signUp(credentials);
      if (result.error) {
        this.errorMessage = result.error.message || 'Signup failed. Please try again.';
      } else if (result.user) {
        const { nextStep } = result.user;
        if (nextStep && nextStep.signUpStep === 'CONFIRM_SIGN_UP') { // Corrected enum value
          this.successMessage = 'Signup successful! Please check your email for a confirmation code.';
          // Navigate to a confirmation page, passing the username (email)
          this.router.navigate(['/auth/confirm-signup'], { queryParams: { username: credentials.email } });
        } else {
          // This case should ideally not happen if autoSignIn is false or confirmation is required.
          // If autoSignIn is enabled and no confirmation needed, user would be signed in.
          this.successMessage = 'Signup successful!';
          // The loggedIn$ subscription in ngOnInit should handle redirect.
        }
        // this.signupForm.reset(); // Reset form on success
      }
    } catch (err: any) {
      this.errorMessage = err.message || 'An unexpected error occurred during signup.';
      console.error('Signup error:', err);
    } finally {
      this.isLoading = false;
    }
  }

  async signInWithGoogle(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = null;
    try {
      await this.authService.signInWithGoogle();
      // Redirect will happen.
    } catch (error: any) {
      this.errorMessage = error.message || 'Google Sign-Up/Sign-In failed.';
      console.error('Google Sign-Up/Sign-In initiation error:', error);
      this.isLoading = false;
    }
  }
}
