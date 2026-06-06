import { BaseEntity } from '../../../shared/domain/model/base-entity';

export type RoleType = 'RETAIL_MANAGER' | 'RESTAURANT_MANAGER';

/**
 * Aggregate root for access management roles.
 */
export class Role implements BaseEntity {
  private readonly _id: string;
  private readonly _name: RoleType;
  private readonly _permissions: string[];

  /**
   * Initializes a new Role instance.
   * @param params - Role initialization parameters.
   */
  constructor(params: { id: string; name: RoleType; permissions?: string[] }) {
    this._id = params.id;
    this._name = params.name;
    this._permissions = params.permissions ?? [];
  }

  get id(): string {
    return this._id;
  }

  get name(): RoleType {
    return this._name;
  }

  get permissions(): string[] {
    return [...this._permissions];
  }

  /**
   * Checks whether the role includes the provided permission.
   * @param permission - The permission to check.
   */
  hasPermission(permission: string): boolean {
    return this._permissions.includes(permission);
  }
}
