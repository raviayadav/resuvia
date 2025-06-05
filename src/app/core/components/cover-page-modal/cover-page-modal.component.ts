import { Component, inject, signal } from '@angular/core';
import { DropboxComponent } from '../dropbox/dropbox.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cover-page-modal',
  imports: [DropboxComponent],
  templateUrl: './cover-page-modal.component.html',
  styleUrl: './cover-page-modal.component.scss'
})
export class CoverPageModalComponent {

  checked = signal(false);
  showEmailSentPage = signal(false);
  activeModal = inject(NgbActiveModal);

  checkedChange(isCHecked: boolean){
    this.checked.set(isCHecked)
  }

   /**
   * on file drop handler
   */
  onFileDropped($event: any) {
    console.log('Cover letter file dropped');
    
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(event?: any) {
   console.log('file browse file handler');
  }

  createCoverPage() {
    this.showEmailSentPage.set(true);
  }

  closeModal() {
    this.activeModal.close();
  }
}
