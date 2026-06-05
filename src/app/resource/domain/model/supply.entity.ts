import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents a base supply registered in the system catalog.
 *
 * A supply defines the general information of an input or product, such as
 * its name, description, category and whether it is perishable.
 */
export class Supply implements BaseEntity {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly category: string,
    public readonly isPerishable: boolean,
  ) {}

  /**
   * Creates a new supply entity.
   *
   * @param id Unique supply identifier.
   * @param name Supply name.
   * @param description Supply description.
   * @param category Supply category.
   * @param isPerishable Indicates whether the supply can expire.
   * @returns A new {@link Supply} instance.
   */
  static create(
    id: string,
    name: string,
    description: string,
    category: string,
    isPerishable: boolean,
  ): Supply {
    return new Supply(id, name, description, category, isPerishable);
  }

  /**
   * Creates an empty supply instance.
   *
   * @returns An empty {@link Supply} instance.
   */
  static empty(): Supply {
    return new Supply('', '', '', '', false);
  }

  /**
   * Backward-compatible alias for older resource views.
   */
  get perishable(): boolean {
    return this.isPerishable;
  }
}
