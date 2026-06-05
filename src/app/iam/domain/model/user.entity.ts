import { BaseEntity } from '../../../shared/domain/model/base-entity';

export type PlanType = 'FREE' | 'PRO';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING';

/**
 * Aggregate root for user identity.
 */
export class User implements BaseEntity {
  private readonly _id: string;
  private readonly _accountId: string;
  private readonly _email: string;
  private readonly _roleId: string;
  private readonly _plan: PlanType;
  private readonly _status: UserStatus;
  private readonly _token?: string;

  /**
   * Initializes a new User instance.
   * @param params - User initialization parameters.
   */
  constructor(params: {
    id: string;
    accountId: string;
    email: string;
    roleId: string;
    plan: PlanType;
    status: UserStatus;
    token?: string;
  }) {
    this._id = params.id;
    this._accountId = params.accountId;
    this._email = params.email;
    this._roleId = params.roleId;
    this._plan = params.plan;
    this._status = params.status;
    this._token = params.token;
  }

  get id(): string {
    return this._id;
  }

  get accountId(): string {
    return this._accountId;
  }

  get email(): string {
    return this._email;
  }

  get roleId(): string {
    return this._roleId;
  }

  get plan(): PlanType {
    return this._plan;
  }

  get status(): UserStatus {
    return this._status;
  }

  get token(): string | undefined {
    return this._token;
  }

  /**
   * Indicates whether the user is currently active.
   */
  get isActive(): boolean {
    return this._status === 'ACTIVE';
  }
}
