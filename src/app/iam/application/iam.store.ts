import { inject, Injectable, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { catchError, forkJoin, of, switchMap, tap } from 'rxjs';
import { IamApi } from '../infrastructure/iam-api';
import { IamRegisteredUsersStorage } from '../infrastructure/iam-registered-users.storage';
import { IamSessionService } from './iam-session.service';
import { SignUpCommand } from '../domain/model/sign-up.command';
import { User } from '../domain/model/user.entity';
import { SignInCommand } from '../domain/model/sign-in.command';
import { ForgotPasswordCommand } from '../domain/model/forgot-password.command';
import { ProfilesApi } from '../../profiles/infrastructure/profiles-api';
import { Profile } from '../../profiles/domain/model/profile.entity';
import { Business } from '../../profiles/domain/model/business.entity';
import { userErrorMessage } from '../../shared/infrastructure/user-error-message';

/**
 * IamStore
 * Handles authentication state and IAM operations for the IAM bounded context.
 */
@Injectable({ providedIn: 'root' })
export class IamStore {
  private readonly router = inject(Router);
  private readonly iamApi = inject(IamApi);
  private readonly session = inject(IamSessionService);
  private readonly registeredUsers = inject(IamRegisteredUsersStorage);
  private readonly profilesApi = inject(ProfilesApi);
  private readonly translate = inject(TranslateService);

  private readonly errorSignal = signal<string | null>(null);
  private readonly loadingSignal = signal(false);
  private readonly successMessageSignal = signal<string | null>(null);

  private readonly pendingEmailSignal = signal<string | null>(null);
  private readonly pendingPasswordSignal = signal<string | null>(null);
  private readonly pendingRoleSignal = signal<'restaurant' | 'retail' | null>(null);
  private readonly pendingProfileSignal = signal<{
    firstName: string;
    lastName: string;
    phoneNumber: string;
    avatarUrl: string | null;
  } | null>(null);
  private readonly pendingAccountIdSignal = signal<string | null>(null);

  readonly currentUser = this.session.currentUser;
  readonly pendingAccountId = this.pendingAccountIdSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly successMessage = this.successMessageSignal.asReadonly();
  readonly isAuthenticated = this.session.isAuthenticated;

  setPendingCredentials(email: string, password: string): void {
    this.pendingEmailSignal.set(email);
    this.pendingPasswordSignal.set(password);
  }

  setPendingRole(role: 'restaurant' | 'retail'): void {
    this.pendingRoleSignal.set(role);
  }

  setPendingProfile(profile: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    avatarUrl: string | null;
  }): void {
    this.pendingProfileSignal.set(profile);
  }

  completeSignUp(params: {
    businessName: string;
    phone?: string;
    country?: string;
    categories: string[];
  }): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.successMessageSignal.set(null);

    const pendingProfile = this.pendingProfileSignal();
    const email = this.pendingEmailSignal() ?? '';
    const password = this.pendingPasswordSignal() ?? '';
    const role = this.pendingRoleSignal();

    const mappedRole = role === 'restaurant'
      ? 'RESTAURANTADMIN'
      : 'RETAILADMIN';

    const signUpCommand = new SignUpCommand({
      email,
      password,
      role: mappedRole,
      businessName: params.businessName,
    });

    this.iamApi.signUp(signUpCommand).pipe(
      tap((response) => {
        const accountId = response.accountId ?? '';

        this.registeredUsers.register(email, password);
        this.pendingAccountIdSignal.set(accountId);
      }),

      switchMap((response) => {
        const userId = response.id;
        const accountId = response.accountId ?? '';

        const signInCommand = new SignInCommand({ email, password });

        return this.iamApi.signIn(signInCommand).pipe(
          tap((user) => this.setCurrentUser(user)),

          switchMap(() => {
            const profile = new Profile({
              profileId: '',
              userId: userId ?? '',
              accountId,
              name: pendingProfile?.firstName ?? '',
              lastName: pendingProfile?.lastName ?? '',
              phoneNumber: pendingProfile?.phoneNumber ?? '',
              avatarUrl: pendingProfile?.avatarUrl ?? '',
              gender: '',
              birthDate: '',
            });

            const business = new Business({
              businessId: '',
              accountId,
              ownerId: userId ?? '',
              companyName: params.businessName,
              ruc: '',
              pictureUrl: '',
              mainLocation: params.country ?? '',
            });

            return forkJoin({
              profile: this.profilesApi.createProfile(profile).pipe(
                catchError((err) => {
                  console.warn('[IamStore] Profile setup incomplete:', err);
                  return of(null);
                }),
              ),
              business: this.profilesApi.createBusiness(business).pipe(
                catchError((err) => {
                  console.warn('[IamStore] Business setup incomplete:', err);
                  return of(null);
                }),
              ),
            });
          }),

          catchError((err) => {
            console.warn('[IamStore] Auto sign-in after sign-up failed:', err);
            this.clearAuthSession();
            return of(null);
          })
        );
      })
    ).subscribe({
      next: () => {
        this.loadingSignal.set(false);
        void this.router.navigate(['/profiles/register/plan'], { replaceUrl: true });
      },

      error: (error) => {
        if (error instanceof HttpErrorResponse && error.status === 409) {
          this.errorSignal.set(this.translate.instant('shared.errors.emailAlreadyRegistered'));
          this.loadingSignal.set(false);
          return;
        }

        this.errorSignal.set(this.formatError(error, 'The user could not be registered.'));
        this.loadingSignal.set(false);
      },
    });
  }

  /**
   * Signs in an existing user.
   * @param command - The sign-in command.
   * @param onSuccess - Optional callback.
   */
  signIn(command: SignInCommand, onSuccess?: () => void): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.successMessageSignal.set(null);

    this.iamApi.signIn(command).subscribe({
      next: (user) => {
        this.setCurrentUser(user);
        onSuccess?.();
      },
      error: (error) => {
        this.errorSignal.set(this.formatError(error, 'No se pudo iniciar sesión.'));
      },
      complete: () => this.loadingSignal.set(false),
    });
  }

  private clearAuthSession(): void {
    this.session.clear();
  }

  /**
   * @param command - El comando con el email del usuario.
   * @param onSuccess - Callback para notificar al usuario que revise su correo.
   */
  forgotPassword(command: ForgotPasswordCommand, onSuccess?: () => void): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.iamApi.forgotPassword(command).subscribe({
      next: () => onSuccess?.(),
      error: (error) => {
        this.errorSignal.set(this.formatError(error, 'No se pudo enviar el correo de recuperación.'));
      },
      complete: () => this.loadingSignal.set(false),
    });
  }

  /**
   * Clears the authenticated session and persisted credentials.
   */
  signOut(): void {
    this.setCurrentUser(null);
    this.errorSignal.set(null);
    this.successMessageSignal.set(null);
  }

  clearSuccessMessage(): void {
    this.successMessageSignal.set(null);
  }

  clearPendingAccountId(): void {
    this.pendingAccountIdSignal.set(null);
  }

  private setCurrentUser(user: User | null): void {
    this.session.setUser(user);
  }

  /**
   * Formats error messages for display.
   */
  private formatError(error: unknown, fallback: string): string {
    return userErrorMessage(error, fallback, (key, params) => this.translate.instant(key, params));
  }
}
