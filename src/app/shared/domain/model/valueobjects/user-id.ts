/**
 * Shared value object: identifier of a user account (string-backed).
 */
export class UserId {
  /**
   * @param value - Stable user id from the identity / accounts context.
   */
  constructor(private readonly value: string) {}

  /**
   * @returns The raw string id.
   */
  getValue(): string {
    return this.value;
  }
}
