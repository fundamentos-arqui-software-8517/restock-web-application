import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResourceStore } from '../../../application/resource.store';
import { IamStore as AuthService } from '../../../../iam/application/iam.store';

const UNIT_MEASUREMENTS = ['Kilograms', 'Liters', 'Dozen', 'Grams', 'Units'] as const;

@Component({
  selector: 'app-create-custom-supply-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-custom-supply-dialog.html',
  styleUrl: './create-custom-supply-dialog.css'
})
export class CreateCustomSupplyDialogComponent implements OnInit {
  @Output() onClose = new EventEmitter<void>();
  @Output() onCreate = new EventEmitter<void>();

  private readonly store = inject(ResourceStore);
  private readonly authService = inject(AuthService);

  readonly supplyTemplates = this.store.supplyTemplates;
  readonly unitMeasurements = UNIT_MEASUREMENTS;

  selectedImageFile: File | null = null;
  imagePreviewUrl: string | null = null;
  private imagePreviewObjectUrl: string | null = null;

  formData = {
    categoryId: '',
    supplyId: '',
    name: '',
    unitMeasurement: UNIT_MEASUREMENTS[0] as string,
    minimumStock: null as number | null,
    maximumStock: null as number | null,
    description: '',
    unitPriceAmount: null as number | null,
    unitPriceCurrencyCode: 'PEN',
    imageUrl: '',
  };

  ngOnInit(): void {
    this.store.loadSupplyTemplates();
  }

  get uniqueCategories(): string[] {
    return [...new Set(this.supplyTemplates().map(t => t.category))];
  }

  get selectedSupplyName(): string {
    const supply = this.supplyTemplates().find(s => s.id === this.formData.supplyId);
    return supply?.name ?? '';
  }

  private get selectedSupplyTemplate() {
    return this.supplyTemplates().find((supply) => supply.id === this.formData.supplyId);
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

  create(): void {
    const user = this.authService.currentUser();
    const accountId = user?.accountId ?? '';
    const selectedSupply = this.selectedSupplyTemplate;

    const unitPrice = `${this.formData.unitPriceAmount ?? 0} ${this.formData.unitPriceCurrencyCode}`;

    const fd = new FormData();
    fd.append('name', this.formData.name || this.selectedSupplyName);
    fd.append('supplyId', this.formData.supplyId);
    fd.append('categoryName', selectedSupply?.category ?? this.formData.categoryId);
    fd.append('minimumStock', String(this.formData.minimumStock ?? 0));
    fd.append('maximumStock', String(this.formData.maximumStock ?? this.formData.minimumStock ?? 0));
    fd.append('unitPrice', unitPrice);
    fd.append('description', this.formData.description || selectedSupply?.description || '');
    fd.append('unitMeasurement', this.formData.unitMeasurement);
    if (this.selectedImageFile) {
      fd.append('image', this.selectedImageFile, this.selectedImageFile.name);
    }

    this.store.createCustomSupply(fd, accountId).subscribe(() => {
      this.onCreate.emit();
      this.onClose.emit();
    });
  }
}


