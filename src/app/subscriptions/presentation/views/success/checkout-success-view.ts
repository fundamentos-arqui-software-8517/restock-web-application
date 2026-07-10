import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IamStore } from '../../../../iam/application/iam.store';

@Component({
  selector: 'app-checkout-success-view',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './checkout-success-view.html',
  styleUrl: './checkout-success-view.css',
})
export class CheckoutSuccessView implements OnInit {
  private readonly router = inject(Router);
  private readonly iamStore = inject(IamStore);

  ngOnInit(): void {
    // Automatically redirect back to settings after 5 seconds if the user does not click the button
    setTimeout(() => {
      this.continueToApp();
    }, 5000);
  }

  continueToApp(): void {
    const pendingAccountId = this.iamStore.pendingAccountId();
    if (pendingAccountId) {
      void this.router.navigate(['/profiles/register/branch']);
    } else {
      void this.router.navigate(['/settings']);
    }
  }
}
