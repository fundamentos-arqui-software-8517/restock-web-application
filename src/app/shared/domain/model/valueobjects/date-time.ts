
export class DateTime {
  /**
   * @param value - ISO-8601 string (or API-compatible date string).
   */
  constructor(private readonly value: string) {}

  /**
   * @returns The persisted / wire-format string.
   */
  getValue(): string {
    return this.value;
  }
}
