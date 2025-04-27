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
      const { error } = await this.authService.signUp(credentials);
      if (error) {
        this.errorMessage = error.message || 'Signup failed. Please try again.';
      } else {
        // Important: Supabase often requires email confirmation.
        // Inform the user to check their email.
        this.successMessage = 'Signup successful! Please check your email to confirm your account.';
        // Optionally clear the form or redirect to a confirmation page/login page after a delay
        this.signupForm.reset();
        // Consider redirecting after a few seconds or providing a link to login
        // setTimeout(() => this.router.navigate(['/login']), 5000);
      }
    } catch (err: any) {
      this.errorMessage = err.message || 'An unexpected error occurred during signup.';
      console.error('Signup error:', err);
    } finally {
      this.isLoading = false;
    }
  }
}
