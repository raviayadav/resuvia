import { CommonModule } from '@angular/common';
import { Component, input} from '@angular/core';

@Component({
  selector: 'app-sub-header',
  imports: [CommonModule],
  templateUrl: './sub-header.component.html',
  styleUrl: './sub-header.component.scss'
})
export class SubHeaderComponent {
   pageType = input<string>('');

}
