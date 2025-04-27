import { Routes } from '@angular/router';
import { ResumeUploadComponent } from './core/components/resume-upload/resume-upload.component';
import { AboutUsComponent } from './core/components/about-us/about-us.component';
import { PlansComponent } from './core/components/plans/plans.component';
import { PageNotFoundComponent } from './core/components/page-not-found/page-not-found.component';
import { LoginComponent } from './features/auth/login/login.component'; // Added
import { SignupComponent } from './features/auth/signup/signup.component'; // Added
import { authGuard } from './core/guards/auth.guard'; // Added

export const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Added
  { path: 'signup', component: SignupComponent }, // Added
  { path: 'upload-resume', component: ResumeUploadComponent }, // Guard added
  { path: 'about-us', component: AboutUsComponent, canActivate: [authGuard] }, // Guard added
  { path: 'plans', component: PlansComponent, canActivate: [authGuard] }, // Guard added
  { path: '',   redirectTo: 'upload-resume', pathMatch: 'full' }, // Consider changing redirect if upload needs auth
  { path: '**', component: PageNotFoundComponent },
];
