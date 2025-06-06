import { Routes } from '@angular/router';
import { MySpaceComponent } from './my-space.component';

export const routes: Routes = [
    {path: '', redirectTo: 'ats-score', pathMatch: 'full'},
    {path: 'ats-score', loadComponent: () => import('../ats-score/ats-score.component').then(m => m.AtsScoreComponent) },
    {path: 'feedback', loadComponent: () => import('../action-feedback/action-feedback.component').then(m => m.ActionFeedbackComponent) },
];
