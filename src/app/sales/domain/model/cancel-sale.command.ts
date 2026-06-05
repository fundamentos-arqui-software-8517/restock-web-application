/**
 * Cancel Sale Command
 * Contains the saleId to cancel the sale.
 */
export class CancelSaleCommand {

  /**
   * The saleId to cancel.
   */
  get saleId() : string {
    return this.saleId;
  }

  /**
   * The saleId to cancel.
   */
  set saleId(value: string) {
    this.saleId = value;
  }

  /**
   * The saleId to cancel.
   */
  private _saleId: string;

  /**
   * Constructor
   * @param resource - The saleId to cancel.
   */
  constructor(resource: {
    saleId: string;
  }) {
    this._saleId = resource.saleId;
  }
}
