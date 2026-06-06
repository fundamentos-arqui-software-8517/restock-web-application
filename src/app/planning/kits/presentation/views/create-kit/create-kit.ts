import { Component, inject, input, output, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { KitItemEntity } from '../../../domain/model/kit-item.entity';
import { RegisterKitCommand } from '../../../domain/command/register-kit.command';
import { KitStore } from '../../../application/kits.store';
import { CustomSupplyEntity } from '../../../../recipes';

@Component({
  selector: 'app-kit-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './create-kit.html',
  styleUrl: './create-kit.css',
})
export class KitFormModalComponent implements OnInit {
  public readonly kitsStore = inject(KitStore);
  isOpen = input.required<boolean>();
  closeModal = output<void>();

  kitName = signal<string>('');
  kitPrice = signal<number>(0);
  kitDescription = signal<string>('');
  KitSku = signal<string>('');
  selectedImage = signal<string | null>(null);
  selectedProductId = signal<string>('');
  inputQuantity = signal<number>(1);
  includedProducts = signal<{ supply: CustomSupplyEntity; quantity: number }[]>([]);
  availableProducts = this.kitsStore.availableSupplies;
  loadingProducts = signal<boolean>(false);

  recommendedPrice = computed(() =>
    this.includedProducts().reduce((acc, p) => acc + p.supply.unitPriceAmount * p.quantity, 0),
  );

  totalCost = computed(() =>
    this.includedProducts().reduce((acc, p) => acc + p.supply.unitPriceAmount * p.quantity, 0),
  );

  ngOnInit(): void {
    this.kitsStore.loadSupplies();
  }

  onClose(): void {
    this.closeModal.emit();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.selectedImage.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  removeProduct(index: number): void {
    this.includedProducts.update((list) => list.filter((_, i) => i !== index));
  }

  addSupply(): void {
    const targetSupply = this.kitsStore
      .availableSupplies()
      .find((s) => s.id === this.selectedProductId());
    if (!targetSupply) return;
    this.includedProducts.update((list) => [
      ...list,
      { supply: targetSupply, quantity: this.inputQuantity() },
    ]);
  }

  onSave(): void {
    const command: RegisterKitCommand = {
      accountId: this.kitsStore.accountId(),
      name: this.kitName(),
      description: this.kitDescription(),
      sku: this.KitSku() || 'DEFAULT-SKU-' + Date.now(),
      type: 'KIT',
      imageUrl: this.selectedImage() || '',
      sellingPrice: this.kitPrice(),
    };
    this.kitsStore.create(command, (newKitId: string) => {
      const itemRequests = this.includedProducts().map((item) => {
        return this.kitsStore.addItem({
          productId: newKitId,
          customSupplyId: item.supply.id,
          quantity: item.quantity,
        });
      });
      this.closeModal.emit();
    });
  }

  getSupplyName(id: string): string {
    return this.kitsStore.availableSupplies().find((s) => s.id === id)?.name ?? 'N/A';
  }

  getSupplySku(id: string): string {
    return this.kitsStore.availableSupplies().find((s) => s.id === id)?.supplyId ?? 'N/A';
  }

  getSupplyPrice(id: string): number {
    return this.kitsStore.availableSupplies().find((s) => s.id === id)?.unitPriceAmount ?? 0;
  }
}
