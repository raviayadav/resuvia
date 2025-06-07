import { Routes } from '@angular/router';
import { ResumeUploadComponent } from './core/components/resume-upload/resume-upload.component';
import { PageNotFoundComponent } from './core/components/page-not-found/page-not-found.component';
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { ConfirmSignupComponent } from './features/auth/confirm-signup/confirm-signup.component'; // Added
import { authGuard } from './core/guards/auth.guard';
import { PaymentSuccessComponent } from './core/components/payment-success/payment-success.component';

export const routes: Routes = [
  { path: '',   redirectTo: 'upload-resume', pathMatch: 'full' }, // Consider changing redirect if upload needs auth
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'auth/confirm-signup', component: ConfirmSignupComponent }, // Added route
  { path: 'upload-resume', component: ResumeUploadComponent }, // Guard added
  { path: 'payment', component: PaymentSuccessComponent  }, // Guard added
  {path: 'my-space', loadComponent: () => import('./core/components/my-space/my-space.component').then(m => m.MySpaceComponent),
        loadChildren: () => import('./core/components/my-space/my-space.routes').then(m => m.routes) ,
     },
  { path: '**', component: PageNotFoundComponent },
];
