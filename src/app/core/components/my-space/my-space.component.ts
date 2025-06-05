import { Component, inject, OnInit, signal } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { SubHeaderComponent } from '../sub-header/sub-header.component';
import { AtsScoreComponent } from '../ats-score/ats-score.component';
import { ActionFeedbackComponent } from '../action-feedback/action-feedback.component';

@Component({
  selector: 'app-my-space',
  imports: [SubHeaderComponent, AtsScoreComponent, ActionFeedbackComponent],
  templateUrl: './my-space.component.html',
  styleUrl: './my-space.component.scss'
})
export class MySpaceComponent implements OnInit {

  pageType = signal('ats-score');
  sharedService = inject(SharedService);

  ngOnInit(): void {
    this.sharedService.pageType.subscribe((data: string)=>{
      this.pageType.set(data);
    })
  }

    setPageType(pageType: string) {
    this.pageType.set(pageType);
    
  }
}
