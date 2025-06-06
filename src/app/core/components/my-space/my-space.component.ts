import { Component, inject, OnInit, signal } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { SubHeaderComponent } from '../sub-header/sub-header.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-my-space',
  imports: [RouterOutlet ,SubHeaderComponent],
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
