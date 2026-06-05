
export class Address {
  /**
   * @param value - Primary location description (single line as stored in DB).
   */
  constructor(private readonly value: string) {}

  /**
   * @returns The address string.
   */
  getValue(): string {
    return this.value;
  }
}
