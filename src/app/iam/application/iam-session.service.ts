import { computed, inject, Injectable, signal } from '@angular/core';

import { User } from '../domain/model/user.entity';
import { IamSessionStorage } from '../infrastructure/iam-session.storage';

/**
 * Minimal authentication session service.
 *
 * Guards and HTTP interceptors should depend on this lightweight service
 * instead of IamStore, which orchestrates IAM workflows and pulls in APIs.
 */
@Injectable({ providedIn: 'root' })
export class IamSessionService {
  private readonly storage = inject(IamSessionStorage);
  private readonly currentUserSignal = signal<User | null>(this.storage.load());

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);
  readonly token = computed(() => this.currentUserSignal()?.token ?? '');

  setUser(user: User | null): void {
    this.currentUserSignal.set(user);

    if (user) {
      this.storage.save(user);
    } else {
      this.storage.clear();
    }
  }

  clear(): void {
    this.setUser(null);
  }
}
