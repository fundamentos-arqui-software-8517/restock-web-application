import { Injectable } from '@angular/core';
import { User } from '../domain/model/user.entity';

const STORAGE_KEY = 'restock_registered_users';

interface RegisteredUserRecord {
  email: string;
  password: string;
}

/** Demo accounts aligned with `server/db.json` for offline / fallback sign-in. */
const DEMO_USERS: RegisteredUserRecord[] = [
  { email: 'rick@gmail.com', password: '12345678' },
  { email: 'prueba@gmail.com', password: '12345678' },
];

/**
 * Persists credentials registered through the app (Beeceptor mocks do not retain users).
 */
@Injectable({ providedIn: 'root' })
export class IamRegisteredUsersStorage {
  register(email: string, password: string): void {
    const normalizedEmail = email.trim().toLowerCase();
    const users = this.readAll().filter((u) => u.email !== normalizedEmail);
    users.push({ email: normalizedEmail, password });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }

  /**
   * Returns true when a normalized email is already stored.
   */
  exists(email: string): boolean {
    const normalizedEmail = email.trim().toLowerCase();
    return this.readAll().some((u) => u.email === normalizedEmail) ||
      DEMO_USERS.some((u) => u.email === normalizedEmail);
  }

  /**
   * Validates credentials against locally stored or demo users.
   */
  authenticate(email: string, password: string): User | null {
    const normalizedEmail = email.trim().toLowerCase();
    const match = [...DEMO_USERS, ...this.readAll()].find(
      (u) => u.email === normalizedEmail && u.password === password,
    );

    if (!match) {
      return null;
    }

    const id = this.hashCode(normalizedEmail);
    return new User({
      id: String(id),
      accountId: `acct_${id}`,
      email: normalizedEmail,
      roleId: 'ROLE_USER',
      plan: 'FREE',
      status: 'ACTIVE',
      token: `local-demo-token-${id}`,
    });
  }

  private readAll(): RegisteredUserRecord[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as RegisteredUserRecord[];
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
  }

  private hashCode(value: string): number {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = (hash << 5) - hash + value.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }
}
