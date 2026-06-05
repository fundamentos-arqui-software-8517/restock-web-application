import { Component, inject, signal, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { IamStore } from '../../../../iam/application/iam.store';

@Component({
  selector: 'app-registration-business-details',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TranslatePipe],
  templateUrl: './registration-business-details.html',
  styleUrl: './registration-business-details.css',
})
export class RegistrationBusinessDetails {
  private readonly router = inject(Router);
  private readonly iamStore = inject(IamStore);

  readonly loading = this.iamStore.loading;
  readonly error = this.iamStore.error;

  readonly countries = [
    'United States',
    'Canada',
    'Mexico',
    'Argentina',
    'Brazil',
    'Colombia',
    'Chile',
    'Peru',
    'Spain',
    'United Kingdom',
  ];

  readonly allCategories = [
    'Pharmaceuticals',
    'IoT Sensors',
    'Cold Storage',
    'Electronics',
    'Food & Beverage',
    'Automotive',
    'Medical Devices',
    'Retail',
    'Manufacturing',
    'Logistics',
  ];

  readonly selectedCategories = signal<string[]>([
    'Pharmaceuticals',
    'IoT Sensors',
    'Cold Storage',
  ]);

  readonly availableToAdd = computed(() =>
    this.allCategories.filter((c) => !this.selectedCategories().includes(c)),
  );

  readonly form = new FormGroup({
    businessName: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl(''),
    address: new FormControl(''),
    city: new FormControl(''),
    country: new FormControl('United States'),
    description: new FormControl(''),
  });

  addCategory(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (value) {
      this.selectedCategories.update((cats) => [...cats, value]);
      (event.target as HTMLSelectElement).value = '';
    }
  }

  removeCategory(category: string): void {
    this.selectedCategories.update((cats) => cats.filter((c) => c !== category));
  }

  onBack(): void {
    this.router.navigate(['/profiles/register']);
  }

  onCreateAccount(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.iamStore.completeSignUp({
      businessName: this.form.value.businessName!,
      phone: this.form.value.phoneNumber ?? undefined,
      country: this.form.value.country ?? undefined,
      categories: this.selectedCategories(),
    });
  }
}
