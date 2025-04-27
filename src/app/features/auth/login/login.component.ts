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
      const { error } = await this.authService.signInWithPassword(credentials);
      if (error) {
        this.errorMessage = error.message || 'Login failed. Please check your credentials.';
      } else {
        // Navigation might be handled by the ngOnInit subscription,
        // but explicit navigation here ensures it happens immediately after login.
        this.router.navigate(['/']); // Navigate to home or dashboard
      }
    } catch (err: any) {
      this.errorMessage = err.message || 'An unexpected error occurred during login.';
      console.error('Login error:', err);
    } finally {
      this.isLoading = false;
      // Reset form state if needed, or handle persistence
      // this.loginForm.reset();
    }
  }
}
