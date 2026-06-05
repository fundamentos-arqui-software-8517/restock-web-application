
export class ImageUrl {
  /**
   * @param value - Absolute or relative URL string.
   */
  constructor(private readonly value: string) {}

  /**
   * @returns The URL string.
   */
  getValue(): string {
    return this.value;
  }
}
