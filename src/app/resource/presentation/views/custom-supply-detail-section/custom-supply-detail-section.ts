import { Component, computed, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, EMPTY } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { environment } from '../../../../../environments/environment';
import { ResourceStore } from '../../../application/resource.store';

interface BatchRow {
  id: string;
  code: string;
  currentStock: number;
  unitMeasurement: string;
  unitMeasurementAbbreviation: string;
  customSupplyId: string;
  branchId: string;
  accountId: string;
  expirationDate: string | null;
  entryDate: string | null;
}

@Component({
  selector: 'app-custom-supply-detail-section',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './custom-supply-detail-section.html',
  styleUrl: './custom-supply-detail-section.css',
})
export class CustomSupplyDetailSectionComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(ResourceStore);
  private readonly http = inject(HttpClient);

  private readonly batchesUrl = `${environment.baseUrl}/batches`;

  params = toSignal(this.route.paramMap);

  customSupply = computed(() =>
    this.store.getCustomSupplyById(this.params()?.get('id') ?? ''),
  );

  readonly batches = signal<BatchRow[]>([]);

  readonly totalStock = computed(() =>
    this.batches().reduce((sum, b) => sum + b.currentStock, 0),
  );

  readonly activeBatchCount = computed(() => this.batches().length);

  constructor() {
    effect(() => {
      const supplyId = this.params()?.get('id') ?? '';
      if (supplyId) {
        this.loadBatches(supplyId);
      }
    });
  }

  private loadBatches(customSupplyId: string): void {
    const params = new HttpParams().set('customSupplyId', customSupplyId);
    this.http
      .get<BatchRow[]>(this.batchesUrl, { params })
      .pipe(
        catchError((err) => {
          console.error('[CustomSupplyDetail] loadBatches error', err);
          this.batches.set([]);
          return EMPTY;
        }),
      )
      .subscribe((list) => this.batches.set(list));
  }

  /**
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

  getBatchHealthKey(expirationDate: string | null): string {
    const labels = { fresh: 'resource.customSupplies.detail.healthFresh', expiring: 'resource.customSupplies.detail.healthExpiring', critical: 'resource.customSupplies.detail.healthCritical' };
    return labels[this.getBatchHealth(expirationDate)];
  }
}
