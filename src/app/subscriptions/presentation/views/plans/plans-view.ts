import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SubscriptionsStore } from '../../../application/subscriptions.store';
import { IamStore } from '../../../../iam/application/iam.store';

@Component({
  selector: 'app-plans-view',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './plans-view.html',
  styleUrl: './plans-view.css',
})
export class PlansView implements OnInit {
  protected readonly store = inject(SubscriptionsStore);
  private readonly iamStore = inject(IamStore);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.store.loadPlans();
    const currentUser = this.iamStore.currentUser();
    if (currentUser) {
      this.store.loadSubscriptionStatus(currentUser.accountId);
    }
  }

  selectPlan(planId: string): void {
    const currentUser = this.iamStore.currentUser();
    if (!currentUser) {
      void this.router.navigate(['/sign-in']);
      return;
    }
    this.store.subscribeToPlan(currentUser.accountId, planId);
  }

  goBack(): void {
    void this.router.navigate(['/settings']);
  }
}
