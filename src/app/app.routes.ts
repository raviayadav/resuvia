import { Routes } from '@angular/router';
import { ResumeUploadComponent } from './core/components/resume-upload/resume-upload.component';
import { AboutUsComponent } from './core/components/about-us/about-us.component';
import { PlansComponent } from './core/components/plans/plans.component';
import { PageNotFoundComponent } from './core/components/page-not-found/page-not-found.component';

export const routes: Routes = [
  { path: 'upload-resume', component: ResumeUploadComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'plans', component: PlansComponent },
  { path: '',   redirectTo: 'upload-resume', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];
