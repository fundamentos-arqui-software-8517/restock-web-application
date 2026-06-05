
export class BusinessId {
  /**
   * @param value - Business document id from persistence.
   */
  constructor(private readonly value: string) {}

  /**
   * @returns The raw string id.
   */
  getValue(): string {
    return this.value;
  }
}
