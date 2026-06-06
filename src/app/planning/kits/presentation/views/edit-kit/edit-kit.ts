import { Component, Input, Output, EventEmitter, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { KitEntity } from '../../../domain/model/kit.entity';
import { UpdateKitCommand } from '../../../domain/command/update-kit.command';
import { KitStore } from '../../../application/kits.store';
import { RemoveKitItemCommand } from '../../../domain/command/remove-kit-item.command';

@Component({
  selector: 'app-edit-kit-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-kit.html',
  styleUrl: './edit-kit.css',
})
export class EditKitModalComponent {
  private readonly fb = inject(FormBuilder);
  protected readonly kitsStore = inject(KitStore);

  @Input() isOpen = false;
  @Input() set kitToEdit(kit: KitEntity | null) {
    if (kit) {
      this._activeKit.set(kit);
      if (!kit.items || kit.items.length === 0) {
        this.kitsStore.loadById(kit.id);
      } else {
        this.populateForm(kit);
      }
    }
  }

  @Output() closeModal = new EventEmitter<void>();

  private _activeKit = signal<KitEntity | null>(null);
  public readonly activeKit = this._activeKit.asReadonly();

  public editForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    sku: [{ value: '', disabled: true }, [Validators.required]],
    description: ['', [Validators.required]],
    items: this.fb.array([]),
  });

  private populateForm(kit: KitEntity): void {
    this.editForm.patchValue({
      name: kit.name,
      sku: kit.sku,
      description: kit.description,
    });
    const itemsArray = this.editForm.get('items') as FormArray;
    itemsArray.clear();
    (kit.items ?? []).forEach((item) => {
      const supply = this.kitsStore.availableSupplies().find((s) => s.id === item.customSupplyId);

      itemsArray.push(
        this.fb.group({
          id: [item.id],
          productId: [kit.id],
          customSupplyId: [item.customSupplyId],
          productName: [supply ? supply.name : 'Desconocido'],
          quantity: [item.quantity, Validators.required],
        }),
      );
    });
  }

  public handleCancel(): void {
    this.closeModal.emit();
  }

  public handleUpdate(): void {
    if (this.editForm.invalid) return;
    const kit = this._activeKit();
    if (!kit) return;

    console.log('kit.id:', kit.id);
    console.log('kit.sellingPrice:', kit.sellingPrice);
    const command: UpdateKitCommand = {
      id: kit.id,
      name: this.editForm.value.name,
      description: this.editForm.value.description,
      sku: kit.sku,
      imageUrl: kit.imageUrl,
      sellingPrice: kit.sellingPrice,
    };
    this.kitsStore.update(command);
    this.closeModal.emit();
  }

  constructor() {
    effect(() => {
      const kit = this._activeKit();
      const supplies = this.kitsStore.availableSupplies();
      if (kit && supplies.length > 0) {
        this.populateForm(kit);
      } else if (kit && kit.items === undefined) {
        console.warn('El kit seleccionado no tiene items. ¿Debes buscarlos por ID?');
      }
    });
  }

  get itemsFormArray(): FormArray {
    return this.editForm.get('items') as FormArray;
  }

  removeComponent(index: number): void {
    const itemsArray = this.editForm.get('items') as FormArray;
    const itemGroup = itemsArray.at(index);
    const productId = itemGroup.get('productId')?.value;
    const customSupplyId = itemGroup.get('customSupplyId')?.value;

    if (productId && customSupplyId) {
      const command: RemoveKitItemCommand = {
        productId: productId,
        customSupplyId: customSupplyId,
      };
      this.kitsStore.removeItem(command);
    }
    itemsArray.removeAt(index);
  }
}
