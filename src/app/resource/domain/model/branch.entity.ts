import { BaseEntity } from '../../../shared/domain/model/base-entity';

export type BranchStatus = 'ACTIVE' | 'INACTIVE';

/**
 * Represents a physical or logical location that owns batches and devices.
 *
 * A branch belongs to an account and acts as the inventory partition
 * boundary: stock movements, telemetry and alerts are always scoped to a branch.
 */
export class Branch implements BaseEntity {
  private constructor(
    public readonly id: string,
    public readonly accountId: string,
    public readonly name: string,
    public readonly description: string,
    public readonly address: string,
    public readonly city: string,
    public readonly regionOrState: string,
    public readonly country: string,
    public readonly status: BranchStatus,
    public readonly imageUrl: string,
    public readonly imagePublicId: string,
  ) {}

  /**
   * Creates a new Branch instance with the provided properties.
   * @param id 
   * @param accountId 
   * @param name 
   * @param description 
   * @param address 
   * @param city 
   * @param regionOrState 
   * @param country 
   * @param status 
   * @param imageUrl 
   * @param imagePublicId 
   * @returns 
   */
  static create(
    id: string,
    accountId: string,
    name: string,
    description: string,
    address: string,
    city: string,
    regionOrState: string,
    country: string,
    status: BranchStatus,
    imageUrl: string,
    imagePublicId: string,
  ): Branch {
    return new Branch(
      id,
      accountId,
      name,
      description,
      address,
      city,
      regionOrState,
      country,
      status,
      imageUrl,
      imagePublicId,
    );
  }

  /**
   * Creates an empty Branch instance.
   * @returns An empty Branch instance with default values.
   */
  static empty(): Branch {
    return new Branch('', '', '', '', '', '', '', '', 'ACTIVE', '', '');
  }

  isActive(): boolean {
    return this.status === 'ACTIVE';
  }

  get location(): string {
    const parts = [this.city, this.regionOrState, this.country].filter(Boolean);
    return parts.join(', ');
  }
}
