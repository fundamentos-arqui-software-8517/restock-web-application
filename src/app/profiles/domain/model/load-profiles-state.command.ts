export class LoadProfilesStateCommand {
  /**
   * @param resource - Optional parameters for future server-side filtering.
   */
  constructor(
    readonly resource: {
      ownerUserId?: string;
    } = {},
  ) {}
}
