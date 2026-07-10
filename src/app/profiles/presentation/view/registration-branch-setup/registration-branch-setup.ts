import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { IamStore } from '../../../../iam/application/iam.store';
import { ResourceStore } from '../../../../resource/application/resource.store';

@Component({
  selector: 'app-registration-branch-setup',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './registration-branch-setup.html',
  styleUrl: './registration-branch-setup.css',
})
export class RegistrationBranchSetup {
  private readonly router = inject(Router);
  private readonly iamStore = inject(IamStore);
  private readonly resourceStore = inject(ResourceStore);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

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

  readonly form = new FormGroup({
    name:          new FormControl('', [Validators.required]),
    address:       new FormControl('', [Validators.required]),
    city:          new FormControl('', [Validators.required]),
    regionOrState: new FormControl('', [Validators.required]),
    country:       new FormControl('United States', [Validators.required]),
  });

  onSkip(): void {
    this.iamStore.clearPendingAccountId();
    this.iamStore.signOut();
    void this.router.navigate(['/sign-in'], { replaceUrl: true });
  }

  onCreateBranch(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const accountId = this.iamStore.pendingAccountId() ?? '';
    this.loading.set(true);
    this.error.set(null);

    this.resourceStore
      .createBranch({
        accountId,
        name:          this.form.value.name!,
        address:       this.form.value.address!,
        city:          this.form.value.city!,
        regionOrState: this.form.value.regionOrState!,
        country:       this.form.value.country!,
      })
      .subscribe({
        next: (branch) => {
          this.resourceStore.setCurrentBranchId(branch.id);
          this.iamStore.clearPendingAccountId();
          this.iamStore.signOut();
          this.loading.set(false);
          void this.router.navigate(['/sign-in'], { replaceUrl: true });
        },
        error: () => {
          this.loading.set(false);
          this.error.set('profiles.registrationBranchSetup.createError');
        },
      });
  }
}
