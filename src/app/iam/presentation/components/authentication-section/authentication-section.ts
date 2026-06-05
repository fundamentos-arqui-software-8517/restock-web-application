import { Component, inject, signal } from '@angular/core';
import { IamStore } from '../../../application/iam.store';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-authentication-section',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './authentication-section.html',
  styleUrl: './authentication-section.css',
})
export class AuthenticationSection {
  private readonly router = inject(Router);
  private readonly iamStore = inject(IamStore);

  selectedRole = signal<'restaurant' | 'retail' | null>(null);

  selectRole(role: 'restaurant' | 'retail'): void {
    this.selectedRole.set(role);
    this.iamStore.setPendingRole(role);
  }

  onContinue(): void {
    if (this.selectedRole()) {
      void this.router.navigate(['/profiles/register']);
    }
  }
}
