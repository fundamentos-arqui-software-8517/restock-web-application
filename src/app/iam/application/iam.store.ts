import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { IamApi } from '../infrastructure/iam-api';
import { IamRegisteredUsersStorage } from '../infrastructure/iam-registered-users.storage';
import { IamSessionStorage } from '../infrastructure/iam-session.storage';
import { SignUpCommand } from '../domain/model/sign-up.command';
import { User } from '../domain/model/user.entity';
import { SignInCommand } from '../domain/model/sign-in.command';
import { ForgotPasswordCommand } from '../domain/model/forgot-password.command';
import { ProfilesApi } from '../../profiles/infrastructure/profiles-api';
import { Profile } from '../../profiles/domain/model/profile.entity';
import { Business } from '../../profiles/domain/model/business.entity';

/**
 * IamStore
 * Handles authentication state and IAM operations for the IAM bounded context.
 */
@Injectable({ providedIn: 'root' })
export class IamStore {
  private readonly router = inject(Router);
  private readonly iamApi = inject(IamApi);
  private readonly sessionStorage = inject(IamSessionStorage);
  private readonly registeredUsers = inject(IamRegisteredUsersStorage);
  private readonly profilesApi = inject(ProfilesApi);

  private readonly currentUserSignal = signal<User | null>(this.sessionStorage.load());
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

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly successMessage = this.successMessageSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);

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
    const role = this.pendingRoleSignal() ?? '';
    const mappedRole = role === 'restaurant' ? 'RESTAURANTADMIN' : 'RETAILADMIN';

    const signUpCommand = new SignUpCommand({
      email,
      password,
      role: mappedRole,
      businessName: params.businessName,
    });

    this.iamApi.signUp(signUpCommand).subscribe({
      next: (response) => {
        const userId = response.id;

        const profile = new Profile({
          profileId: `profile_${Date.now()}`,
          userId: userId,
          name: pendingProfile?.firstName ?? '',
          lastName: pendingProfile?.lastName ?? '',
          phoneNumber: pendingProfile?.phoneNumber ?? '',
          avatarUrl: pendingProfile?.avatarUrl ?? 'https://placehold.co/150',
          gender: 'UNKNOWN',
          birthDate: new Date().toISOString(),
        });

        const business = new Business({
          businessId: `business_${Date.now()}`,
          companyName: params.businessName,
          ruc: '0000000000',
          pictureUrl: 'https://placehold.co/150',
          mainLocation: params.country ?? '',
          ownerId: userId,
        });
        forkJoin({
          profile: this.profilesApi.createProfile(profile),
          business: this.profilesApi.createBusiness(business),
        }).subscribe({
          error: (err) => console.warn('[IamStore] Profile/business setup incomplete:', err),
        });

        this.registeredUsers.register(email, password);
        this.clearAuthSession();
        this.successMessageSignal.set(
          'Account created successfully. Log in with your email and password.',
        );
        this.loadingSignal.set(false);
        void this.router.navigate(['/sign-in'], { replaceUrl: true });
      },
      error: (error) => {
        if (error instanceof HttpErrorResponse && error.status === 409) {
          this.errorSignal.set('The email address is already registered.');
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
    this.currentUserSignal.set(null);
    this.sessionStorage.clear();
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

  private setCurrentUser(user: User | null): void {
    this.currentUserSignal.set(user);
    if (user) {
      this.sessionStorage.save(user);
    } else {
      this.sessionStorage.clear();
    }
  }

  /**
   * Formats error messages for display.
   */
  private formatError(error: unknown, fallback: string): string {
    if (error instanceof Error && error.message) {
      return error.message.includes('Resource not found')
        ? `${fallback}: recurso no encontrado.`
        : error.message;
    }
    return fallback;
  }
}
