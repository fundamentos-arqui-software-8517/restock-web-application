import { Component, inject, input, output, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KitItem } from '../../../domain/model/kit-item.entity';
import { KitsStore } from '../../../application/kits.store';
import { RegisterKitCommand } from '../../../domain/command/register-kit.command';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-kit-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './create-kit.html',
  styleUrl: './create-kit.css',
})
export class KitFormModalComponent implements OnInit {
  public readonly kitsStore = inject(KitsStore);

  isOpen = input.required<boolean>();
  closeModal = output<void>();

  kitName = signal<string>('');
  kitPrice = signal<number>(0);
  kitDescription = signal<string>('');

  selectedImage = signal<string | null>(null);

  readonly availableProducts = this.kitsStore.products;
  readonly loadingProducts = this.kitsStore.loadingProducts;
  selectedProductId = signal<string>('');
  inputQuantity = signal<number>(1);

  includedProducts = signal<KitItem[]>([]);

  totalCost = computed(() => {
    return this.includedProducts().reduce((sum, item) => sum + item.quantity * item.price, 0);
  });

  recommendedPrice = computed(() => {
    const total = this.totalCost();
    return total > 0 ? total + 24.5 : 0;
  });

  constructor() {}

  ngOnInit(): void {
    this.kitsStore.loadAllProducts();
  }

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files[0]) {
      const file = inputElement.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  addSupply(): void {
    if (!this.selectedProductId()) {
      alert('Por favor, seleccione un producto válido de la lista.');
      return;
    }

    const targetProduct = this.availableProducts().find((p) => p.id === this.selectedProductId());
    if (!targetProduct) return;

    try {
      const newItem = new KitItem({
        id: targetProduct.id,
        name: targetProduct.name,
        sku: targetProduct.sku,
        price: targetProduct.price,
        quantity: this.inputQuantity(),
      });

      const existingItem = this.includedProducts().find((item) => item.id === newItem.id);
      if (existingItem) {
        existingItem.changeQuantity(existingItem.quantity + newItem.quantity);
        this.includedProducts.update((list) => [...list]);
      } else {
        this.includedProducts.update((list) => [...list, newItem]);
      }

      this.selectedProductId.set('');
      this.inputQuantity.set(1);
    } catch (error: any) {
      alert(error.message);
    }
  }

  removeProduct(index: number): void {
    this.includedProducts.update((products) => products.filter((_, i) => i !== index));
  }

  onClose(): void {
    this.resetForm();
    this.closeModal.emit();
  }

  onSave(): void {
    if (!this.kitName().trim()) {
      alert('Por favor, ingresa el nombre del Kit.');
      return;
    }
    if (this.includedProducts().length === 0) {
      alert('Debes incluir al menos un producto en el Kit.');
      return;
    }

    const command = new RegisterKitCommand({
      name: this.kitName(),
      price: this.kitPrice(),
      description: this.kitDescription().trim() || 'No description provided',
      imageUrl: this.selectedImage() || 'https://placehold.co/209x201',
      items: this.includedProducts(),
    });

    this.kitsStore.registerKit(command, () => {
      this.resetForm();
      this.closeModal.emit();
    });
  }

  private resetForm(): void {
    this.includedProducts.set([]);
    this.kitName.set('');
    this.kitPrice.set(0);
    this.kitDescription.set('');
    this.inputQuantity.set(1);
    this.selectedImage.set(null);
    this.selectedProductId.set('');
  }
}
