export class ProfileId {
  /**
   * @param value - Identificador único del perfil en persistencia.
   */
  constructor(private readonly value: string) {}

  /**
   * @returns The raw string id.
   */
  getValue(): string {
    return this.value;
  }
}
