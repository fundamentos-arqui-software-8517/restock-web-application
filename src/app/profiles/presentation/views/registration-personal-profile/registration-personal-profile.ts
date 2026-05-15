import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration-personal-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registration-personal-profile.html',
  styleUrl: './registration-personal-profile.css',
})
export class RegistrationPersonalProfile {
  @Output() skipped = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
  @Output() next = new EventEmitter<typeof this.form.value>();

  private readonly router = inject(Router);

  readonly countries = [
    'United States', 'Canada', 'Mexico', 'Argentina', 'Brazil',
    'Colombia', 'Chile', 'Peru', 'Spain', 'United Kingdom',
  ];

  readonly form = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    phoneNumber: new FormControl(''),
    address: new FormControl(''),
    city: new FormControl(''),
    country: new FormControl('United States'),
    avatar: new FormControl<File | null>(null),
  });

  avatarPreview: string | null = null;

  onAvatarSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.loadAvatarFile(file);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) this.loadAvatarFile(file);
  }

  onSkip(): void {
    this.skipped.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  onNext(): void {
    this.next.emit(this.form.value);
    void this.router.navigate(['/profiles/register/business']);
  }

  private loadAvatarFile(file: File): void {
    this.form.get('avatar')?.setValue(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      this.avatarPreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}
