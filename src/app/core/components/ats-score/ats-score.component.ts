import { Component, EventEmitter, inject, Output } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { FeedbackCardComponent } from '../feedback-card/feedback-card.component';

@Component({
  selector: 'app-ats-score',
  imports: [FeedbackCardComponent],
  providers: [SharedService],
  templateUrl: './ats-score.component.html',
  styleUrl: './ats-score.component.scss'
})
export class AtsScoreComponent {
  sharedService = inject(SharedService);
  @Output() pageName =  new EventEmitter<string>;
  
  checkFeedbackCard(){
    this.pageName.emit('feedback-card');
  }
}
