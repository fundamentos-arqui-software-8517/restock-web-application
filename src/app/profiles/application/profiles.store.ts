import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, forkJoin, of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { ProfilesApi } from '../infrastructure/profiles-api';
import { Profile } from '../domain/model/profile.entity';
import { Business } from '../domain/model/business.entity';
import { LoadProfilesStateCommand } from '../domain/model/load-profiles-state.command';
import { UpdateProfileCommand } from '../domain/model/update-profile.command';
import { UpdateBusinessCommand } from '../domain/model/update-business.command';
import { IamStore } from '../../iam/application/iam.store';
import { userErrorMessage } from '../../shared/infrastructure/user-error-message';

const PROFILE_BRANCH_ID_KEY = 'restock.profile.currentBranchId';

/**
 * Exposes state with signals, orchestrates domain commands, and delegates HTTP to {@link ProfilesApi}.
 */
@Injectable({ providedIn: 'root' })
export class ProfilesStore {
  private readonly destroyRef = inject(DestroyRef);
  private readonly iamStore = inject(IamStore);
  private readonly translate = inject(TranslateService);

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
   * Loads the profile and business associated with the current account.
   *
   * @param _command - Explicit domain command object for discoverability and future filters.
   */
  loadProfilesState(_command: LoadProfilesStateCommand = new LoadProfilesStateCommand()): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    const accountId = this.iamStore.currentUser()?.accountId;

    if (!accountId || accountId.trim() === '') {
      this.profileSignal.set(null);
      this.businessSignal.set(null);
      this.errorSignal.set('Cannot load profiles state: missing accountId.');
      this.loadingSignal.set(false);
      return;
    }

    // If we already have data in memory (e.g. called multiple times due to reactive
    // effects), skip the network round-trip to avoid resetting the signals.
    if (this.profileSignal() !== null || this.businessSignal() !== null) {
      this.loadingSignal.set(false);
      return;
    }

    forkJoin({
      profile: this.profilesApi.getProfileByAccountId(accountId).pipe(
        catchError((err) => this.nullIfNotFound<Profile>(err))
      ),
      business: this.profilesApi.getBusinessByAccountId(accountId).pipe(
        catchError((err) => this.nullIfNotFound<Business>(err))
      ),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ profile, business }) => {
          console.log('[ProfilesStore] loadProfilesState — profile.id:', profile?.id, '| business.id:', business?.id);
          this.profileSignal.set(profile);
          this.businessSignal.set(business);
          this.loadingSignal.set(false);
        },
        error: (err: unknown) => {
          this.errorSignal.set(this.formatError(err, 'Failed to load profiles state.'));
          this.loadingSignal.set(false);
        },
      });
  }

  /**
   * Forces a reload from the server, bypassing the in-memory cache.
   * Call this after a successful create/update to refresh the signals.
   */
  reloadProfilesState(): void {
    this.profileSignal.set(null);
    this.businessSignal.set(null);
    this.loadProfilesState();
  }

  /**
   * Persists profile edits using the command DTO, then refreshes the in-memory aggregate.
   *
   * @param command - Snapshot produced by the presentation layer.
   */
  updateProfile(command: UpdateProfileCommand): void {
    const current = this.profileSignal();
    const accountId = this.iamStore.currentUser()?.accountId ?? '';

    // Resolve the profile ID: prefer the command value, then the in-memory signal.
    // This guards against the race where the component saves before the effect fires.
    const profileId = command.profileId || current?.id || '';

    console.log('[ProfilesStore] updateProfile — profileId:', profileId, '| command.profileId:', command.profileId, '| current?.id:', current?.id);

    const profile = new Profile({
      profileId,
      accountId,
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

    const request$ = profileId
      ? this.profilesApi.updateProfile(profile, profileId, command.imageFile)
      : this.profilesApi.createProfile(profile, command.imageFile);

    request$
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

  saveBusiness(command: UpdateBusinessCommand): void {
    const current = this.businessSignal();
    const accountId = this.iamStore.currentUser()?.accountId ?? '';

    // Resolve the business ID: prefer the command value, then the in-memory signal.
    const businessId = command.businessId || current?.id || '';

    console.log('[ProfilesStore] saveBusiness — businessId:', businessId, '| command.businessId:', command.businessId, '| current?.id:', current?.id);

    const business = new Business({
      businessId,
      accountId,
      ownerId: command.userId,
      companyName: command.companyName,
      ruc: command.ruc,
      pictureUrl: command.pictureUrl,
      mainLocation: command.mainLocation,
    });

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    const request$ = businessId
      ? this.profilesApi.updateBusiness(business, businessId, command.imageFile)
      : this.profilesApi.createBusiness(business, command.imageFile);

    request$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.businessSignal.set(updated);
          this.loadingSignal.set(false);
        },
        error: (err: unknown) => {
          this.errorSignal.set(this.formatError(err, 'Failed to save business.'));
          this.loadingSignal.set(false);

          if (current) {
            this.businessSignal.set(current);
          }
        },
      });
  }

  setCurrentBranchId(branchId: string): void {
    this.currentBranchIdSignal.set(branchId);
    this.saveCurrentBranchId(branchId);
  }

  /**
   * Converts a 404 response into null.
   *
   * This allows the screen to load even when the account does not have
   * a profile or business created yet.
   */
  private nullIfNotFound<T>(error: unknown) {
    if (error instanceof HttpErrorResponse && error.status === 404) {
      return of(null as T | null);
    }

    return throwError(() => error);
  }

  /**
   * @param error - Value captured in the RxJS `error` callback.
   * @param fallback - Default message if it's not an instance of `Error`.
   */
  private formatError(error: unknown, fallback: string): string {
    return userErrorMessage(error, fallback, (key, params) => this.translate.instant(key, params));
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
