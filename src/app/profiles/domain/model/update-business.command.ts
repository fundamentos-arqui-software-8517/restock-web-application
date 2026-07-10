export class UpdateBusinessCommand {
  readonly imageFile?: File;

  constructor(
    readonly businessId: string,
    readonly userId: string,
    readonly companyName: string,
    readonly ruc: string,
    readonly pictureUrl: string,
    readonly mainLocation: string,
    imageFile?: File,
  ) {
    this.imageFile = imageFile;
  }
}
