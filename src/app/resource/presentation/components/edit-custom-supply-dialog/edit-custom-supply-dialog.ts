import { Component, EventEmitter, Input, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResourceStore } from '../../../application/resource.store';
import { CustomSupply } from '../../../domain/model/custom-supply.entity';

const UNIT_MEASUREMENTS = ['Kilograms', 'Liters', 'Dozen', 'Grams', 'Units'] as const;
const UNIT_ALIASES: Record<string, string> = {
  kg: 'Kilograms',
  kilogram: 'Kilograms',
  kilograms: 'Kilograms',
  l: 'Liters',
  liter: 'Liters',
  liters: 'Liters',
  doz: 'Dozen',
  dozen: 'Dozen',
  g: 'Grams',
  gram: 'Grams',
  grams: 'Grams',
  unit: 'Units',
  units: 'Units',
};

@Component({
  selector: 'app-edit-custom-supply-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-custom-supply-dialog.html',
  styleUrl: './edit-custom-supply-dialog.css'
})
export class EditCustomSupplyDialogComponent implements OnInit {
  @Input({ required: true }) customSupply!: CustomSupply;
  @Output() onClose = new EventEmitter<void>();
  @Output() onUpdate = new EventEmitter<void>();

  private readonly store = inject(ResourceStore);

  readonly unitMeasurements = UNIT_MEASUREMENTS;

  selectedImageFile: File | null = null;
  imagePreviewUrl: string | null = null;
  private imagePreviewObjectUrl: string | null = null;

  formData = {
    name: '',
    unitMeasurement: UNIT_MEASUREMENTS[0] as string,
    minimumStock: null as number | null,
    maximumStock: null as number | null,
    description: '',
    unitPriceAmount: null as number | null,
    unitPriceCurrencyCode: 'PEN',
  };

  private originalDataStr = '';

  ngOnInit(): void {
    this.formData = {
      name: this.customSupply.name,
      unitMeasurement: this.unitMeasurementName(this.customSupply.unit.name || this.customSupply.unit.abbreviation),
      minimumStock: this.customSupply.minStock,
      maximumStock: this.customSupply.maxStock,
      description: this.customSupply.description,
      unitPriceAmount: this.customSupply.unitPrice,
      unitPriceCurrencyCode: 'PEN',
    };
    this.imagePreviewUrl = this.customSupply.imgUrl || null;
    this.originalDataStr = JSON.stringify(this.formData);
  }

  hasUnsavedChanges(): boolean {
    return this.originalDataStr !== JSON.stringify(this.formData);
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.selectedImageFile = file;
      this.readImagePreview(file);
      input.value = '';
    }
  }

  onImageDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedImageFile = file;
      this.readImagePreview(file);
    }
  }

  private readImagePreview(file: File): void {
    if (this.imagePreviewObjectUrl) {
      URL.revokeObjectURL(this.imagePreviewObjectUrl);
    }

    this.imagePreviewObjectUrl = URL.createObjectURL(file);
    this.imagePreviewUrl = this.imagePreviewObjectUrl;
  }

  cancel(): void {
    this.onClose.emit();
  }

  update(): void {
    const unitPrice = `${this.formData.unitPriceAmount ?? 0} ${this.formData.unitPriceCurrencyCode}`;

    const fd = new FormData();
    fd.append('name', this.formData.name);
    fd.append('description', this.formData.description);
    fd.append('minimumStock', String(this.formData.minimumStock ?? 0));
    fd.append('maximumStock', String(this.formData.maximumStock ?? 0));
    fd.append('unitPrice', unitPrice);
    fd.append('unitMeasurement', this.formData.unitMeasurement);
    if (this.selectedImageFile) {
      fd.append('image', this.selectedImageFile, this.selectedImageFile.name);
    }

    this.store.updateCustomSupply(this.customSupply.id, fd, this.customSupply.accountId).subscribe(() => {
      this.originalDataStr = JSON.stringify(this.formData);
      this.onUpdate.emit();
      this.onClose.emit();
    });
  }

  private unitMeasurementName(value: string): string {
    return UNIT_ALIASES[value.trim().toLowerCase()] ?? value;
  }
}

