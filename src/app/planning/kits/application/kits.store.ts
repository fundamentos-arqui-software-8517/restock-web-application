import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, map, of, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Kit } from '../domain/model/kit.entity';
import { KitItem } from '../domain/model/kit-item.entity';
import { KitsApi } from '../infrastructure/kits-api';
import { RegisterKitCommand } from '../domain/command/register-kit.command';
import { UpdateKitCommand } from '../domain/command/update-kit.command';

@Injectable({
  providedIn: 'root',
})
export class KitsStore {
  private readonly destroyRef = inject(DestroyRef);
  private readonly kitsApi = inject(KitsApi);

  readonly #kits = signal<Kit[]>([]);
  readonly #products = signal<KitItem[]>([]);
  readonly #isLoading = signal<boolean>(false);
  readonly #loadingProducts = signal<boolean>(false);
  readonly #error = signal<string | null>(null);

  readonly kits = this.#kits.asReadonly();
  readonly products = this.#products.asReadonly();
  readonly activeKits = computed(() => this.#kits());
  readonly isLoading = this.#isLoading.asReadonly();
  readonly loadingProducts = this.#loadingProducts.asReadonly();
  readonly error = this.#error.asReadonly();

  readonly totalKits = computed(() => this.#kits().length);

  loadAllKits(): void {
    console.log('Intentando cargar kits...');
    this.#isLoading.set(true);
    this.#error.set(null);

    this.kitsApi
      .getAllKits()
      .pipe(
        tap((kits) => {
          console.log('Kits recibidos de la API:', kits);
          this.#kits.set(kits);
        }),
        catchError((error) => {
          console.error('Error al cargar kits:', error);
          this.#error.set(this.formatError(error, 'Failed to fetch kits collection.'));
          return of([]);
        }),
        finalize(() => this.#isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  loadAllProducts(): void {
    if (this.#products().length > 0) return;

    this.#loadingProducts.set(true);
    this.#error.set(null);

    this.kitsApi
      .getAllProducts()
      .pipe(
        map((rawProducts: any[]) =>
          rawProducts.map(
            (p) =>
              new KitItem({
                id: p.id,
                name: p.name,
                sku: p.sku,
                price: p.price,
                quantity: 1,
              }),
          ),
        ),
        tap((kitItems) => this.#products.set(kitItems)),
        catchError((error) => {
          this.#error.set(this.formatError(error, 'Failed to load available products.'));
          return of([]);
        }),
        finalize(() => this.#loadingProducts.set(false)),
        takeUntilDestroyed(this.destroyRef), // ◄ Protegido
      )
      .subscribe();
  }

  registerKit(command: RegisterKitCommand, onSuccess?: () => void): void {
    this.#isLoading.set(true);
    this.#error.set(null);

    this.kitsApi
      .registerKit(command)
      .pipe(
        tap(() => {
          this.loadAllKits();
          onSuccess?.();
        }),
        catchError((error) => {
          this.#error.set(this.formatError(error, 'Failed to register the new kit.'));
          return of(null);
        }),
        finalize(() => this.#isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  updateKit(command: UpdateKitCommand, onSuccess?: () => void): void {
    this.#isLoading.set(true);
    this.#error.set(null);

    this.kitsApi
      .updateKit(command)
      .pipe(
        tap((updatedKit) => {
          this.#kits.update((currentKits) =>
            currentKits.map((kit) => (kit.id === updatedKit.id ? updatedKit : kit)),
          );
          onSuccess?.();
        }),
        catchError((error) => {
          this.#error.set(this.formatError(error, 'Failed to update the kit setup.'));
          return of(null);
        }),
        finalize(() => this.#isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found')
        ? `${fallback}: Not found`
        : error.message;
    }
    return fallback;
  }
}
