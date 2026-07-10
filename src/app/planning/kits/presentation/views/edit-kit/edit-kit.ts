import { Component, Input, Output, EventEmitter, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormArray,
  FormsModule,
} from '@angular/forms';
import { KitEntity } from '../../../domain/model/kit.entity';
import { UpdateKitCommand } from '../../../domain/command/update-kit.command';
import { KitStore } from '../../../application/kits.store';
import { RemoveKitItemCommand } from '../../../domain/command/remove-kit-item.command';
import { CustomSupplyEntity } from '../../../domain/model/custom-supply.entity';

type PendingOperation = (done: () => void) => void;

@Component({
  selector: 'app-edit-kit-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
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
      if (kit.items === undefined && !this._detailRequestedIds.has(kit.id)) {
        this._detailRequestedIds.add(kit.id);
        this.kitsStore.loadById(kit.id);
      } else if (kit.items !== undefined) {
        if (this.itemsFormArray.length === 0 && this.kitsStore.availableSupplies().length > 0) {
          this.populateForm(kit);
        }
      }
    } else {
      this.itemsFormArray.clear();
      this._suppliesToDelete.set([]);
      this._activeKit.set(null);
    }
  }

  @Output() closeModal = new EventEmitter<void>();

  private _activeKit = signal<KitEntity | null>(null);
  public readonly activeKit = this._activeKit.asReadonly();
  private readonly _detailRequestedIds = new Set<string>();
  private readonly _suppliesToDelete = signal<string[]>([]);

  // ── Add Supply panel state ───────────────────────────────────────────────
  showAddSupplyPanel = signal(false);
  selectedSupplyId = signal<string>('');
  newItemQuantity = signal<number>(1);

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
          originalQuantity: [item.quantity],
          isNew: [false],
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

    const command: UpdateKitCommand = {
      id: kit.id,
      name: this.editForm.value.name,
      description: this.editForm.value.description,
      sku: kit.sku,
      imageUrl: kit.imageUrl,
      sellingPrice: kit.sellingPrice,
    };
    this.kitsStore.update(command);
    const ops = this._buildItemOperations(kit.id);
    this._runOperations(ops, () => {
      this.closeModal.emit();
    });
  }

  constructor() {
    effect(() => {
      const kit = this._activeKit();
      const supplies = this.kitsStore.availableSupplies();
      if (kit && supplies.length > 0 && this.itemsFormArray.length === 0) {
        this.populateForm(kit);
      }
    });
  }

  get itemsFormArray(): FormArray {
    return this.editForm.get('items') as FormArray;
  }

  removeComponent(index: number): void {
    const itemGroup = this.itemsFormArray.at(index);
    if (!itemGroup) return;

    const isNew = itemGroup.get('isNew')?.value;
    const customSupplyId = itemGroup.get('customSupplyId')?.value;
    if (!isNew && customSupplyId) {
      this._suppliesToDelete.update((ids) => [...ids, customSupplyId]);
    }
    this.itemsFormArray.removeAt(index);
    this.editForm.markAsDirty();
  }
  getAvailableSuppliesToAdd(): CustomSupplyEntity[] {
    return this.kitsStore.availableSupplies();
  }

  toggleAddSupplyPanel(): void {
    this.showAddSupplyPanel.update((v) => !v);
    if (!this.showAddSupplyPanel()) {
      this.selectedSupplyId.set('');
      this.newItemQuantity.set(1);
    }
  }

  confirmAddSupply(): void {
    const supplyId = this.selectedSupplyId();
    const qtyToAdd = this.newItemQuantity();
    if (!supplyId) return;
    const supplies = this.kitsStore.availableSupplies();
    const targetSupply = supplies.find((s) => s.id === supplyId);
    if (!targetSupply) return;
    const existingControlIndex = this.itemsFormArray.controls.findIndex(
      (control) => control.value.customSupplyId === supplyId,
    );
    if (existingControlIndex !== -1) {
      const control = this.itemsFormArray.at(existingControlIndex);
      const currentQty = control.get('quantity')?.value || 0;
      control.get('quantity')?.setValue(currentQty + qtyToAdd);
      control.get('quantity')?.markAsDirty();
    } else {
      this.itemsFormArray.push(
        this.fb.group({
          customSupplyId: [targetSupply.id],
          productName: [targetSupply.name],
          quantity: [qtyToAdd, [Validators.required, Validators.min(1)]],
          originalQuantity: [0],
          isNew: [true],
        }),
      );
    }
    this.selectedSupplyId.set('');
    this.newItemQuantity.set(1);
    this.showAddSupplyPanel.set(false);
  }

  private _buildItemOperations(kitId: string): PendingOperation[] {
    const ops: PendingOperation[] = [];
    this._suppliesToDelete().forEach((supplyId) => {
      ops.push((done) => {
        this.kitsStore.removeItem({ productId: kitId, customSupplyId: supplyId }, () => done());
      });
    });

    this.itemsFormArray.controls.forEach((control) => {
      const value = control.value;

      if (value.isNew) {
        ops.push((done) => {
          this.kitsStore.addItem(
            { productId: kitId, customSupplyId: value.customSupplyId, quantity: value.quantity },
            () => done(),
          );
        });
        return;
      }

      if (value.quantity !== value.originalQuantity) {
        ops.push((done) => {
          this.kitsStore.removeItem(
            { productId: kitId, customSupplyId: value.customSupplyId },
            () => {
              this.kitsStore.addItem(
                {
                  productId: kitId,
                  customSupplyId: value.customSupplyId,
                  quantity: value.quantity,
                },
                () => done(),
              );
            },
          );
        });
      }
    });
    return ops;
  }

  private _runOperations(ops: PendingOperation[], onDone: () => void, index = 0): void {
    if (index >= ops.length) {
      onDone();
      return;
    }
    ops[index](() => this._runOperations(ops, onDone, index + 1));
  }
}
