import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service'; // Adjust path

@Component({
  selector: 'app-confirm-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './confirm-signup.component.html',
  styleUrls: ['./confirm-signup.component.scss'] // You can create this or reuse other auth styles
})
export class ConfirmSignupComponent implements OnInit {
  confirmForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  username: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.confirmForm = this.fb.group({
      username: ['', Validators.required], // Will be pre-filled from query params
      code: ['', [Validators.required, Validators.minLength(6)]] // Typical Cognito code length
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.username = params['username'];
      if (this.username) {
        this.confirmForm.patchValue({ username: this.username });
      } else {
        this.errorMessage = 'Username not provided. Please go back to signup.';
        // Consider redirecting or disabling form if username is missing
      }
    });
  }

  async onSubmit(): Promise<void> {
    if (this.confirmForm.invalid || this.isLoading || !this.username) {
      if (!this.username) this.errorMessage = "Username is missing from the form.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    const { code } = this.confirmForm.value;

    try {
      const { success, error } = await this.authService.confirmSignUp(this.username, code);
      if (success) {
        this.successMessage = 'Account confirmed successfully! You can now log in.';
        // Redirect to login page after a short delay
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      } else {
        this.errorMessage = error?.message || 'Confirmation failed. Please check the code and try again.';
      }
    } catch (err: any) {
      this.errorMessage = err.message || 'An unexpected error occurred during confirmation.';
      console.error('Confirmation error:', err);
    } finally {
      this.isLoading = false;
    }
  }

  async onResendCode(): Promise<void> {
    if (!this.username || this.isLoading) {
      if (!this.username) this.errorMessage = "Username is missing. Cannot resend code.";
      return;
    }
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    try {
      const { success, error } = await this.authService.resendConfirmationCode(this.username);
      if (success) {
        this.successMessage = 'A new confirmation code has been sent to your email.';
      } else {
        this.errorMessage = error?.message || 'Failed to resend code. Please try again.';
      }
    } catch (err: any) {
      this.errorMessage = err.message || 'An unexpected error occurred while resending the code.';
    } finally {
      this.isLoading = false;
    }
  }
}
