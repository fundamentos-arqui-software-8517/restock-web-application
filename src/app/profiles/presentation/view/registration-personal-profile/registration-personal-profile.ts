import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { IamStore } from '../../../../iam/application/iam.store';

@Component({
  selector: 'app-registration-personal-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TranslatePipe],
  templateUrl: './registration-personal-profile.html',
  styleUrl: './registration-personal-profile.css',
})
export class RegistrationPersonalProfile {
  private readonly router = inject(Router);
  private readonly iamStore = inject(IamStore);

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

  /** Skip personal profile — go directly to business details */
  onSkip(): void {
    void this.router.navigate(['/profiles/register/business']);
  }

  /** Cancel registration — return to sign-up */
  onCancel(): void {
    void this.router.navigate(['/sign-up']);
  }

  onNext(): void {
    const fv = this.form.value;
    this.iamStore.setPendingProfile({
      firstName: fv.firstName ?? '',
      lastName: fv.lastName ?? '',
      phoneNumber: fv.phoneNumber ?? '',
      avatarUrl: this.avatarPreview ?? null,
    });

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
