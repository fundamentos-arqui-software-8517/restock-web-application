import { Injectable, signal, computed, inject } from '@angular/core';
import { KitEntity } from '../domain/model/kit.entity';
import { RegisterKitCommand } from '../domain/command/register-kit.command';
import { UpdateKitCommand } from '../domain/command/update-kit.command';
import { AddKitItemCommand } from '../domain/command/add-kit-item.command';
import { RemoveKitItemCommand } from '../domain/command/remove-kit-item.command';
import { DeleteKitCommand } from '../domain/command/delete-kit.command';
import { KitsApiEndpoint } from '../infrastructure/kits-api';
import { CustomSupplyEntity } from '../domain/model/custom-supply.entity';

export type ModalMode = 'create' | 'edit' | null;

@Injectable({ providedIn: 'root' })
export class KitStore {
  private readonly api = inject(KitsApiEndpoint);

  readonly kits = signal<KitEntity[]>([]);
  readonly availableSupplies = signal<CustomSupplyEntity[]>([]);
  readonly accountId = signal<string>('6a21a239af5d1ab5fca17747');
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly modalMode = signal<ModalMode>(null);
  readonly totalKits = computed(() => this.kits().length);
  readonly activeKits = computed(() => this.kits().filter((k) => k.type === 'KIT'));

  loadAllKits(): void {
    if (this.loading()) return;

    this.loading.set(true);

    this.api.getAllKits(this.accountId()).subscribe({
      next: (data) => {
        this.kits.set(data);
        this.loading.set(false);
        this.error.set(null);
      },
      error: (err) => {
        console.error('Error detectado en la API:', err);
        this.error.set('No pudimos conectar con el servidor.');
        this.loading.set(false);
      },
    });
  }

  create(cmd: RegisterKitCommand, onCreated: (id: string) => void): void {
    this.saving.set(true);
    this.api.register(cmd).subscribe({
      next: (newKit) => {
        this.kits.update((currentKits) => [...currentKits, newKit]);
        this.saving.set(false);
        onCreated(newKit.id);
      },
      error: (err) => {
        this.saving.set(false);
        if (err.status === 409) {
          console.error('El SKU ya existe, intenta con otro.');
        } else {
          console.error('Error al crear:', err);
        }
      },
    });
  }

  update(cmd: UpdateKitCommand): void {
    this.saving.set(true);
    this.api.update(cmd).subscribe({
      next: (updatedKit) => {
        this.kits.update((currentKits) =>
          currentKits.map((kit) => (kit.id === updatedKit.id ? updatedKit : kit)),
        );
        this.saving.set(false);
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        this.saving.set(false);
      },
    });
  }

  addItem(cmd: AddKitItemCommand): void {
    this.saving.set(true);
    this.api.addItem(cmd).subscribe({
      next: (entity) => {
        this._patchKit(entity);
        this.saving.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.saving.set(false);
      },
    });
  }

  removeItem(cmd: RemoveKitItemCommand): void {
    this.saving.set(true);
    this.api.removeItem(cmd).subscribe({
      next: () => {
        this.loadAllKits();
        this.saving.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.saving.set(false);
      },
    });
  }

  delete(cmd: DeleteKitCommand): void {
    this.saving.set(true);
    this.api.delete(cmd).subscribe({
      next: () => {
        this.kits.update((list) => list.filter((k) => k.id !== cmd.id));
        this.saving.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.saving.set(false);
      },
    });
  }

  loadSupplies(): void {
    this.loading.set(true);
    this.api.getSupplies(this.accountId()).subscribe({
      next: (supplies) => {
        this.availableSupplies.set(supplies);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  loadById(id: string): void {
    this.loading.set(true);
    this.api.getKitById(id).subscribe({
      next: (detailedKit) => {
        console.log('loadById response:', detailedKit);
        console.log('items after mapping:', detailedKit.items);
        this._patchKit(detailedKit);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('loadById error:', err);
        this.loading.set(false);
      },
    });
  }

  private _patchKit(updated: KitEntity): void {
    this.kits.update((list) => list.map((k) => (k.id === updated.id ? updated : k)));
  }
}
