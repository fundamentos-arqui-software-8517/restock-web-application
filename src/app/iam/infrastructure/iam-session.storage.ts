import { Injectable } from '@angular/core';
import { User, type PlanType, type UserStatus } from '../domain/model/user.entity';

const SESSION_KEY = 'restock_iam_session';

interface IamSessionDto {
  id: string;
  accountId: string;
  email: string;
  roleId: string;
  plan: PlanType;
  status: UserStatus;
  token?: string;
}

/**
 * Persists IAM session in the browser for reload-safe authentication.
 */
@Injectable({ providedIn: 'root' })
export class IamSessionStorage {
  save(user: User): void {
    const dto: IamSessionDto = {
      id: user.id,
      accountId: user.accountId,
      email: user.email,
      roleId: user.roleId,
      plan: user.plan,
      status: user.status,
      token: user.token,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(dto));
  }

  load(): User | null {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) {
      return null;
    }

    try {
      const dto = JSON.parse(raw) as IamSessionDto;
      return new User({
        id: dto.id,
        accountId: dto.accountId,
        email: dto.email,
        roleId: dto.roleId,
        plan: dto.plan,
        status: dto.status,
        token: dto.token,
      });
    } catch {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
  }

  clear(): void {
    localStorage.removeItem(SESSION_KEY);
  }
}
