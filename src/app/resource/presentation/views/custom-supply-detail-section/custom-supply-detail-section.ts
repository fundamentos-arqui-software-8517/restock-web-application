import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ResourceStore } from '../../../application/resource.store';

@Component({
  selector: 'app-custom-supply-detail-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './custom-supply-detail-section.html',
  styleUrl: './custom-supply-detail-section.css',
})
export class CustomSupplyDetailSectionComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(ResourceStore);

  params = toSignal(this.route.paramMap);

  customSupply = computed(() =>
    this.store.getCustomSupplyById(this.params()?.get('id') ?? ''),
  );
  /**
   * Health status based on days until expiration.
   * Fresh: > 30 days | Expiring Soon: 1–30 days | Critical Care: today or expired
   */
  getBatchHealth(expirationDate: string | null): 'fresh' | 'expiring' | 'critical' {
    if (!expirationDate) return 'fresh';
    const diff = Math.ceil(
      (new Date(expirationDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    if (diff > 30) return 'fresh';
    if (diff > 0) return 'expiring';
    return 'critical';
  }

  getBatchHealthLabel(expirationDate: string | null): string {
    const labels = { fresh: 'Fresh', expiring: 'Expiring Soon', critical: 'Critical Care' };
    return labels[this.getBatchHealth(expirationDate)];
  }
}
