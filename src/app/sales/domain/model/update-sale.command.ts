import { SaleStatus } from './sale-status.enum';

/**
 * Update Sale Command
 * Contains the saleId and saleStatus to update the sale.
 */
export class UpdateSaleCommand {

  /**
   * The saleId to update.
   */
  get saleId() : string {
    return this.saleId;
  }

  /**
   * The saleStatus to update.
   * @returns string - The saleId to update.
   */
  set saleId(value: string) {
    this.saleId = value;
  }

  /**
   * The saleStatus to update.
   * @returns SaleStatus - The saleStatus to update.
   */
  get saleStatus() : SaleStatus {
    return this.saleStatus;
  }

  /**
   * The saleStatus to update.
   * @returns SaleStatus - The saleStatus to update.
   */
  set saleStatus(value: SaleStatus) {
    this.saleStatus = value;
  }

  /**
   * The saleId to update.
   * @private saleId is stored as a string to allow for flexibility in naming conventions.
   */
  private _saleId: string;

  /**
   * The saleStatus to update.
   * @private saleStatus is stored as a SaleStatus enum.
   */
  private _saleStatus: SaleStatus;

  /**
   * Initialize a new instance of the UpdateSaleCommand class.
   * @param resource - The saleId and saleStatus to update.
   */
  constructor(resource : {
    saleId: string;
    saleStatus: SaleStatus;
  }) {
    this._saleId = resource.saleId;
    this._saleStatus = resource.saleStatus;
  }
}
