import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { SalesApi } from '../infrastructure/sales-api';
import { Sale } from '../domain/model/sale.entity';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * SalesStore
 * Handles the business logic for register-sale operations.
 */
@Injectable({ providedIn: 'root' })
export class SalesStore {
  private readonly destroyRef = inject(DestroyRef);

  private readonly BRANCH_ID = 'branch_01';

  // State Signals
  private readonly salesSignal = signal<Sale[]>([]);
  private readonly errorSignal = signal<string | null>(null);
  private readonly loadingSignal = signal<boolean>(false);

  // Readonly Signals
  readonly sales = this.salesSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  // Computed Signals
  readonly salesCount = computed(() => this.salesSignal().length);
  readonly loading = this.loadingSignal.asReadonly();

  /**
   * Constructor
   * @param salesApi - SalesApi instance for making API calls.
   */
  constructor(private salesApi: SalesApi) {}

  /**
   * Loads sales by branch id.
   */
  loadSalesByBranchId(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.salesApi
      .getSalesByBranchId(this.BRANCH_ID)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (sales) => {
          this.salesSignal.set(sales);
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to load sales by branch id.'));
          this.loadingSignal.set(false);
        },
      });
  }

  /**
   * Formats error messages.
   * @private
   * @param error - The error object.
   * @param fallback - The fallback error message.
   * @returns The formatted error message.
   */
  private formatError(error: any, fallback: string): string {
    if (error instanceof Error)
      return error.message.includes('Resource not found')
        ? `${fallback}: Not found`
        : error.message;
    return fallback;
  }
}
