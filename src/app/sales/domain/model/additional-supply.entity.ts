/**
 * Represents additional supply for a sale.
 */
export class AdditionalSupply {

  /**
   * The batch ID associated with the additional supply.
   * @private Batch IDs are stored as strings to allow for unique identifiers.
   */
  private _batchId: string;

  /**
   * The quantity of additional supply.
   * @private Quantities are stored as strings to allow for decimal quantities.
   */
  private _quantity: string;

  /**
   * Create an AdditionalSupply
   * @param additionalSupply - An object containing the batch ID and quantity of additional supply.
   */
  constructor(additionalSupply: {
    batchId: string;
    quantity: string;
  }) {
    this._batchId = additionalSupply.batchId;
    this._quantity = additionalSupply.quantity;
  }
}
