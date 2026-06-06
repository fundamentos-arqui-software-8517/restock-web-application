import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { ProfilesApi } from '../infrastructure/profiles-api';
import { Profile } from '../domain/model/profile.entity';
import { Business } from '../domain/model/business.entity';
import { LoadProfilesStateCommand } from '../domain/model/load-profiles-state.command';
import { UpdateProfileCommand } from '../domain/model/update-profile.command';

const PROFILE_BRANCH_ID_KEY = 'restock.profile.currentBranchId';

/**
 * Exposes state with signals, orchestrates domain commands, and delegates HTTP to {@link ProfilesApi}.
 */
@Injectable({ providedIn: 'root' })
export class ProfilesStore {
  private readonly destroyRef = inject(DestroyRef);

  private readonly profileSignal = signal<Profile | null>(null);
  private readonly businessSignal = signal<Business | null>(null);
  private readonly errorSignal = signal<string | null>(null);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly currentBranchIdSignal = signal<string>(this.loadCurrentBranchId());

  readonly profile = this.profileSignal.asReadonly();
  readonly business = this.businessSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly currentBranchId = this.currentBranchIdSignal.asReadonly();

  readonly hasProfile = computed(() => this.profileSignal() !== null);
  readonly hasBusiness = computed(() => this.businessSignal() !== null);

  /**
   * @param profilesApi - Fachada HTTP del contexto profiles.
   */
  constructor(private readonly profilesApi: ProfilesApi) {}

  /**
   * Loads the first profile and first business returned by the API.
   *
   * @param _command - Explicit domain command object for discoverability and future filters.
   */
  loadProfilesState(_command: LoadProfilesStateCommand = new LoadProfilesStateCommand()): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    forkJoin({
      profiles: this.profilesApi.getProfiles(),
      businesses: this.profilesApi.getBusinesses(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ profiles, businesses }) => {
          this.profileSignal.set(profiles[0] ?? null);
          this.businessSignal.set(businesses[0] ?? null);
          this.loadingSignal.set(false);
        },
        error: (err: unknown) => {
          this.errorSignal.set(this.formatError(err, 'Failed to load profiles state.'));
          this.loadingSignal.set(false);
        },
      });
  }

  /**
   * Persists profile edits using the command DTO, then refreshes the in-memory aggregate.
   *
   * @param command - Snapshot produced by the presentation layer.
   */
  updateProfile(command: UpdateProfileCommand): void {
    const current = this.profileSignal();
    const profile = new Profile({
      profileId: command.profileId,
      userId: command.userId,
      name: command.name,
      lastName: command.lastName,
      phoneNumber: command.phoneNumber.getValue(),
      avatarUrl: command.avatarUrl,
      gender: command.gender,
      birthDate: command.birthDate,
    });

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.profilesApi
      .updateProfile(profile, command.profileId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.profileSignal.set(updated);
          this.loadingSignal.set(false);
        },
        error: (err: unknown) => {
          this.errorSignal.set(this.formatError(err, 'Failed to update profile.'));
          this.loadingSignal.set(false);
          if (current) {
            this.profileSignal.set(current);
          }
        },
      });
  }

  setCurrentBranchId(branchId: string): void {
    this.currentBranchIdSignal.set(branchId);
    this.saveCurrentBranchId(branchId);
  }

  /**
   * @param error - Value captured in the RxJS `error` callback.
   * @param fallback - Default message if it's not an instance of `Error`.
   */
  private formatError(error: unknown, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found')
        ? `${fallback}: Not found`
        : error.message;
    }
    return fallback;
  }

  private loadCurrentBranchId(): string {
    try {
      return localStorage.getItem(PROFILE_BRANCH_ID_KEY) ?? '';
    } catch {
      return '';
    }
  }

  private saveCurrentBranchId(branchId: string): void {
    try {
      if (branchId) {
        localStorage.setItem(PROFILE_BRANCH_ID_KEY, branchId);
      } else {
        localStorage.removeItem(PROFILE_BRANCH_ID_KEY);
      }
    } catch {
      // Preference persistence is best-effort only.
    }
  }
}
