import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents a unit of measurement used by supplies.
 *
 * A unit measure defines how a supply quantity is expressed, for example:
 * kilograms, grams, liters or units.
 */
export class UnitMeasure implements BaseEntity {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly abbreviation: string,
  ) {}

  /**
   * Creates a new unit measure entity.
   *
   * @param id Unique unit measure identifier.
   * @param name Unit measure name.
   * @param abbreviation Short abbreviation of the unit measure.
   * @returns A new {@link UnitMeasure} instance.
   */
  static create(id: string, name: string, abbreviation: string): UnitMeasure {
    return new UnitMeasure(id, name, abbreviation);
  }

  /**
   * Creates an empty unit measure instance.
   *
   * @returns An empty {@link UnitMeasure} instance.
   */
  static empty(): UnitMeasure {
    return new UnitMeasure('', '', '');
  }
}
