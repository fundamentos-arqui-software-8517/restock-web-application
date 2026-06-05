import { Component, Input, Output, EventEmitter, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { Kit } from '../../../domain/model/kit.entity';
import { KitsStore } from '../../../application/kits.store';

@Component({
  selector: 'app-edit-kit-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-kit.html',
  styleUrl: './edit-kit.css',
})
export class EditKitModalComponent {
  private readonly fb = inject(FormBuilder);
  protected readonly kitsStore = inject(KitsStore);

  @Input() isOpen = false;
  @Input() set kitToEdit(kit: Kit | null) {
    if (kit) {
      this._activeKit.set(kit);
      this.populateForm(kit);
    }
  }
  @Output() closeModal = new EventEmitter<void>();

  private _activeKit = signal<Kit | null>(null);
  public readonly activeKit = this._activeKit.asReadonly();

  public editForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    sku: [{ value: '', disabled: true }, [Validators.required]],
    description: ['', [Validators.required]],
    items: this.fb.array([]),
  });

  get itemsFormArray(): FormArray {
    return this.editForm.get('items') as FormArray;
  }

  private populateForm(kit: Kit): void {
    this.editForm.patchValue({
      name: kit.name,
      sku: kit.sku || `${kit.name.replace(/\s+/g, '-').toUpperCase()}`,
      description: kit.description || 'No description provided.',
    });
    this.itemsFormArray.clear();
    if (kit.items && kit.items.length > 0) {
      kit.items.forEach((item) => {
        this.itemsFormArray.push(
          this.fb.group({
            productName: [item.name],
            quantity: [item.quantity, [Validators.required, Validators.min(1)]],
          }),
        );
      });
    }
  }

  public removeComponent(index: number): void {
    this.itemsFormArray.removeAt(index);
  }

  public handleCancel(): void {
    this.closeModal.emit();
  }

  public handleUpdate(): void {
    if (this.editForm.invalid) return;

    const updatedData = {
      ...this.activeKit(),
      name: this.editForm.value.name,
      description: this.editForm.value.description,
      items: this.editForm.getRawValue().items,
    };

    console.log('Enviando actualización estratégica a Restock:', updatedData);
    this.closeModal.emit();
  }
}
