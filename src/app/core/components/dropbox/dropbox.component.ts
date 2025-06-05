import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-dropbox',
  imports: [],
  templateUrl: './dropbox.component.html',
  styleUrl: './dropbox.component.scss'
})
export class DropboxComponent {
  onFileDropped = output<void>();
  fileBrowseHandler = output<void>();
  title = input('');
  subTitle = input('');

  onFileDroppedEvent($event: any) {
    this.onFileDropped.emit($event)
  }

  onFileBrowseHandler($event: any){
    this.fileBrowseHandler.emit($event);
  }
}
