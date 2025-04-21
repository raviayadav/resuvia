import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AppChart } from '../chart/chart.component';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-ats-score',
  imports: [AppChart],
  providers: [SharedService],
  templateUrl: './ats-score.component.html',
  styleUrl: './ats-score.component.scss'
})
export class AtsScoreComponent {
  sharedService = inject(SharedService);
  @Output() pageType =  new EventEmitter<string>;
  
  checkFeedbackCard(){
    this.pageType.emit('feedback-card');
  }
}
