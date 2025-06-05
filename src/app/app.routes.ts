import { Routes } from '@angular/router';
import { ResumeUploadComponent } from './core/components/resume-upload/resume-upload.component';
import { PageNotFoundComponent } from './core/components/page-not-found/page-not-found.component';
import { LoginComponent } from './features/auth/login/login.component'; // Added
import { SignupComponent } from './features/auth/signup/signup.component'; // Added
import { authGuard } from './core/guards/auth.guard'; // Added
import { PaymentSuccessComponent } from './core/components/payment-success/payment-success.component';
import { MySpaceComponent } from './core/components/my-space/my-space.component';

export const routes: Routes = [
  { path: '',   redirectTo: 'upload-resume', pathMatch: 'full' }, // Consider changing redirect if upload needs auth
  { path: 'login', component: LoginComponent }, // Added
  { path: 'signup', component: SignupComponent }, // Added
  { path: 'upload-resume', component: ResumeUploadComponent }, // Guard added
  { path: 'payment', component: PaymentSuccessComponent  }, // Guard added
  { path: 'my-space', component: MySpaceComponent  }, // Guard added
  { path: '**', component: PageNotFoundComponent },
];
