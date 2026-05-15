import { Injectable, inject, signal } from '@angular/core';
import { Profile } from '../domain/model/profile.entity';
import { Business } from '../domain/model/business.entity';
import { ProfilesApi } from '../infrastructure/profiles-api';

@Injectable({ providedIn: 'root' })
export class ProfilesStore {
  private readonly api = inject(ProfilesApi);
  private loaded = false;

  readonly profile = signal<Profile | null>(null);
  readonly business = signal<Business | null>(null);
  readonly loading = signal(false);

  load(): void {
    if (this.loaded) return;
    this.loaded = true;
    this.loading.set(true);

    this.api.getProfiles().subscribe({
      next: (profiles) => {
        if (profiles.length > 0) this.profile.set(profiles[0]);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    this.api.getBusinesses().subscribe({
      next: (businesses) => {
        if (businesses.length > 0) this.business.set(businesses[0]);
      },
    });
  }
}
