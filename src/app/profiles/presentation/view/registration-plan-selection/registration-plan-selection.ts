import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SubscriptionsStore } from '../../../../subscriptions/application/subscriptions.store';
import { IamStore } from '../../../../iam/application/iam.store';

@Component({
  selector: 'app-registration-plan-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './registration-plan-selection.html',
  styleUrl: './registration-plan-selection.css',
})
export class RegistrationPlanSelection implements OnInit {
  private readonly router = inject(Router);
  readonly store = inject(SubscriptionsStore);
  private readonly iamStore = inject(IamStore);

  readonly accountId = computed(() => this.iamStore.currentUser()?.accountId || this.iamStore.pendingAccountId() || '');

  ngOnInit(): void {
    this.store.loadPlans();
  }

  selectPlan(planId: string): void {
    const accId = this.accountId();
    if (!accId) {
      alert('Session details not found. Please log in and try again.');
      void this.router.navigate(['/sign-in']);
      return;
    }
    this.store.subscribeToPlan(accId, planId);
  }

  contactSales(): void {
    alert('Thank you for your interest! A sales representative will contact you shortly.');
  }

  viewDocs(): void {
    window.open('https://docs.restock.io', '_blank');
  }

  skipToFreeTier(): void {
    // Route directly to branch setup without a paid subscription
    void this.router.navigate(['/profiles/register/branch']);
  }
}
