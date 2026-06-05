
export class PhoneNumber {
  /**
   * @param value - Digits and optional formatting as returned by the API.
   */
  constructor(private readonly value: string) {}

  /**
   * @returns The phone string.
   */
  getValue(): string {
    return this.value;
  }
}
