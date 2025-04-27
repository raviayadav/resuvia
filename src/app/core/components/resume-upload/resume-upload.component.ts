import { Component, computed, inject, Signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { SubHeaderComponent } from "../sub-header/sub-header.component";
import { FeedbackCardComponent } from '../feedback-card/feedback-card.component';
import { AtsScoreComponent } from '../ats-score/ats-score.component';
import { SharedService } from '../../services/shared.service';
import { PaymentSuccessComponent } from "../payment-success/payment-success.component";

@Component({
  selector: 'app-resume-upload',
  imports: [SubHeaderComponent, FeedbackCardComponent, AtsScoreComponent, PaymentSuccessComponent],
  providers: [],
  templateUrl: './resume-upload.component.html',
  styleUrl: './resume-upload.component.scss',
})
export class ResumeUploadComponent {
  
  files: any[] = [];
  pageType = 'resume-upload';

  /**
   * on file drop handler
   */
  onFileDropped($event: any) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(event?: any) {
    const files = event.target.files || event.srcElement.files;
    this.prepareFilesList(files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.uploadFilesSimulator(0);
  }

  uploadFiles(){
    this.pageType = 'ats-score';
  }

  setPageType(pageType: string) {
    this.pageType = pageType;
    
  }


}
