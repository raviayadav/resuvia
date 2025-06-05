import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'feedback-card',
  imports: [],
  templateUrl: './feedback-card.component.html',
  styleUrl: './feedback-card.component.scss'
})
export class FeedbackCardComponent {
  route = inject(Router)

  redirectTo(path: string){
    this.route.navigate([path]);
  }
}
