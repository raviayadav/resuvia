import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoverPageModalComponent } from '../cover-page-modal/cover-page-modal.component';

@Component({
  selector: 'action-feedback',
  imports: [],
  providers: [NgbModal],
  templateUrl: './action-feedback.component.html',
  styleUrl: './action-feedback.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ActionFeedbackComponent {
  modalService = inject(NgbModal);

  createCoverLetter(){
    this.modalService.open(CoverPageModalComponent,{
        backdrop:true,
        backdropClass: 'cover-modal-backdrop',
        modalDialogClass: 'cover-modal-dialog',
        windowClass: 'cover-modal-window-dialog',
        centered: true
      }
    )
  }

  downloadFeedback() {
    console.log("Download feedback button clicked");
  }
}
