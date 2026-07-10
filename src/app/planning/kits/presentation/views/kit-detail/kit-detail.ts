import { Component, inject, signal, OnInit, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { KitStore } from '../../../application/kits.store';
import { KitEntity } from '../../../domain/model/kit.entity';
import { CustomSupplyEntity } from '../../../domain/model/custom-supply.entity';
import { DeleteKitCommand } from '../../../domain/command/delete-kit.command';
import { EditKitModalComponent } from '../edit-kit/edit-kit';

@Component({
  selector: 'app-kit-detail',
  standalone: true,
  imports: [CommonModule, EditKitModalComponent],
  templateUrl: './kit-detail.html',
  styleUrl: './kit-detail.css',
})
export class KitDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly kitId = signal<string | null>(null);
  readonly kitsStore = inject(KitStore);

  isEditOpen = signal(false);

  readonly kit = computed(() => this.kitsStore.kits().find((k) => k.id === this.kitId()) ?? null);

  readonly chartBars = [0.4, 0.6, 0.55, 0.85, 0.7, 0.95, 0.8];

  readonly fallbackImage =
    'https://st.depositphotos.com/9012638/52754/i/450/depositphotos_527544842-stock-photo-meal-kit-delivery-concept-set.jpg?h=400&w=600&fit=crop';

  isDeleteConfirmOpen = signal(false);
  private readonly _detailRequestedIds = new Set<string | null>();

  constructor() {
    effect(() => {
      const kit = this.kit();
      if (kit && kit.items === undefined && !this._detailRequestedIds.has(kit.id)) {
        this._detailRequestedIds.add(kit.id);
        this.kitsStore.loadById(kit.id);
      }
    });
  }

  openEditModal(): void {
    if (this.kitsStore.availableSupplies().length === 0) {
      this.kitsStore.loadSupplies();
    }
    this.isEditOpen.set(true);
  }

  closeEditModal(): void {
    this.isEditOpen.set(false);
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.kitsStore.loadById(id);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/kits']);
      return;
    }
    this.kitId.set(id);
    if (!this._detailRequestedIds.has(id)) {
      this._detailRequestedIds.add(id);
      this.kitsStore.loadById(id);
    }
    if (this.kitsStore.kits().length === 0 && !this.kitsStore.loading()) {
      this.kitsStore.loadAllKits();
    }
    if (this.kitsStore.availableSupplies().length === 0) {
      this.kitsStore.loadSupplies();
    }
  }

  getSupply(id: string): CustomSupplyEntity | undefined {
    return this.kitsStore.availableSupplies().find((s) => s.id === id);
  }

  getSupplyName(productId: string): string {
    return this.getSupply(productId)?.name ?? 'Unknown Supply';
  }

  getSupplyDescription(productId: string): string {
    return this.getSupply(productId)?.supplyName ?? '';
  }

  getSupplySku(productId: string): string {
    const supply = this.getSupply(productId);
    return supply?.supplyId || supply?.id || '—';
  }

  getSupplyStock(productId: string): number {
    return this.getSupply(productId)?.minimumStock ?? 0;
  }

  getSupplyImage(productId: string): string {
    return this.getSupply(productId)?.pictureUrl ?? '';
  }

  goBack(): void {
    this.router.navigate(['/kits']);
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = this.fallbackImage;
  }

  onDelete(): void {
    this.isDeleteConfirmOpen.set(true);
  }

  closeDeleteConfirm(): void {
    this.isDeleteConfirmOpen.set(false);
  }

  confirmDelete(): void {
    const kit = this.kit();
    if (!kit) return;
    const cmd: DeleteKitCommand = { id: kit.id };
    this.kitsStore.delete(cmd);
    this.router.navigate(['/kits']);
  }
}
