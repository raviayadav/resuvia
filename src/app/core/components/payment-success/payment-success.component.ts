import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-payment-success',
  imports: [],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.scss'
})
export class PaymentSuccessComponent {

  private router = inject(Router);
  private sharedService = inject(SharedService);

  redirectTo(path: string){
    this.router.navigate(['my-space/feedback']);
    this.sharedService.pageType.next('action-feedback');
  }
}
