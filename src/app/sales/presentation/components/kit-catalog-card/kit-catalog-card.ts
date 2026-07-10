import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { KitEntity } from '../../../../planning/kits/domain/model/kit.entity';

/**
 * A single sellable tile in the POS catalog (Kits screen). Purely visual:
 * shows the kit's picture, SKU, name, price and an availability badge based
 * on its current status, and emits `add` when the "+" button is pressed.
 */
@Component({
  selector: 'app-kit-catalog-card',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './kit-catalog-card.html',
  styleUrl: './kit-catalog-card.css',
})
export class KitCatalogCardComponent {
  @Input({ required: true }) kit!: KitEntity;
  @Output() add = new EventEmitter<KitEntity>();

  private readonly translate = inject(TranslateService);

  readonly fallbackImage =
    'https://st.depositphotos.com/9012638/52754/i/450/depositphotos_527544842-stock-photo-meal-kit-delivery-concept-set.jpg?h=400&w=600&fit=crop';

  get isSellable(): boolean {
    return this.kit.status !== 'LOW_STOCK';
  }

  get availabilityLabel(): string {
    switch (this.kit.status) {
      case 'LOW_STOCK':
        return this.translate.instant('sales.kitCard.availability.zeroKits');
      case 'RESTOCK':
        return this.translate.instant('sales.kitCard.availability.restocking');
      default:
        return this.translate.instant('sales.kitCard.availability.available');
    }
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = this.fallbackImage;
  }
}
