import { Component, EventEmitter, Output, signal, computed, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration-business-details',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registration-business-details.html',
  styleUrl: './registration-business-details.css',
})
export class RegistrationBusinessDetails {
  @Output() createAccount = new EventEmitter<object>();

  private readonly router = inject(Router);

  readonly countries = [
    'United States', 'Canada', 'Mexico', 'Argentina', 'Brazil',
    'Colombia', 'Chile', 'Peru', 'Spain', 'United Kingdom',
  ];

  readonly allCategories = [
    'Pharmaceuticals', 'IoT Sensors', 'Cold Storage', 'Electronics',
    'Food & Beverage', 'Automotive', 'Medical Devices', 'Retail',
    'Manufacturing', 'Logistics',
  ];

  readonly selectedCategories = signal<string[]>([
    'Pharmaceuticals', 'IoT Sensors', 'Cold Storage',
  ]);

  readonly availableToAdd = computed(() =>
    this.allCategories.filter((c) => !this.selectedCategories().includes(c))
  );

  readonly form = new FormGroup({
    businessName: new FormControl(''),
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
    this.createAccount.emit({
      ...this.form.value,
      categories: this.selectedCategories(),
    });
  }
}
