import { Component, inject,  OnInit, OnDestroy, signal } from '@angular/core';
import { SubHeaderComponent } from "../sub-header/sub-header.component";
import { ActionFeedbackComponent } from '../action-feedback/action-feedback.component';
import { SharedService } from '../../services/shared.service';
import { ReplaySubject, takeUntil } from 'rxjs';
import { DropboxComponent } from '../dropbox/dropbox.component';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-resume-upload',
  imports: [SubHeaderComponent, DropboxComponent],
  providers: [],
  templateUrl: './resume-upload.component.html',
  styleUrl: './resume-upload.component.scss',
})
export class ResumeUploadComponent  implements OnInit , OnDestroy{
  
  files: any[] = [];
  pageType = 'resume-upload';
  sharedService = inject(SharedService);
  destroy$ : ReplaySubject<boolean> = new ReplaySubject(1);
  buttonTitle = signal<string>('Upload');
  dropBoxTitle = signal("Click/Drag & drop your resume");
  router = inject(Router);
  modalService = inject(NgbModal); // Assuming NgbModal is provided in your app module

  ngOnInit(): void {
    this.sharedService.pageType.pipe(takeUntil(this.destroy$)).subscribe((data: string)=>{
      this.pageType = data;
    })
  }

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
      this.buttonTitle.set('Start ATS Analysis ');
      this.dropBoxTitle.set(this.files[index].name);
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
    this.openSignupModal();
  }

  openSignupModal() {
      const signUpModalRef =  this.modalService.open(SignupComponent,{
            backdrop:true,
            backdropClass: 'signup-modal-backdrop',
            modalDialogClass: 'signup-modal-dialog',
            windowClass: 'signup-modal-window-dialog',
            centered: true
          }
        );
      signUpModalRef.result.then(
        (result) => {
            // This block is executed when the modal is closed using close() method or the close button.
            console.log('Modal closed with result:', result);
        },
        (reason) => {
          this.sharedService.pageType.next('ats-score');
          this.router.navigate(['my-space']);
            // This block is executed when the modal is dismissed using dismiss() method or clicking outside the modal.
            console.log('Modal dismissed with reason:', reason);
        }
        
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }


}
