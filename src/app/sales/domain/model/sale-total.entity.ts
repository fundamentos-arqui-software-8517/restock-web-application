/**
 * Represents the total amount of a sale, including the subtotal, tax, and total.
 */
export class SaleTotal {

  /**
   * The subtotal amount of the sale, representing the total cost of items before tax.
   * @private Sale Totals are stored as numbers to allow for decimal quantities.
   */
  private _subTotal: number;

  /**
   * The tax of the sale, representing the amount of tax applied to the subtotal.
   * @private Taxes are stored as numbers to allow for decimal quantities.
   */
  private _tax: number;

  /**
   * The total amount of the sale, representing the total cost of items including tax.
   * @private Totals are stored as numbers to allow for decimal quantities.
   */
  private _total: number;

  /**
   * Create a SaleTotal
   * @param SaleTotal - An object containing the subtotal, tax, and total amounts for the sale.
   */
  constructor(SaleTotal: {
    subTotal: number;
    tax: number;
    total: number;
  }) {
    this._subTotal = SaleTotal.subTotal;
    this._tax = SaleTotal.tax;
    this._total = SaleTotal.total;
  }

  /**
   * Getter for the subtotal amount of the sale.
   * @returns The subtotal amount of the sale.
   */
  get subTotal() {
    return this._subTotal;
  }

  /**
   * Getter for the tax amount of the sale.
   * @returns The tax amount of the sale.
   */
  get tax() {
    return this._tax;
  }

  /**
   * Getter for the total amount of the sale.
   * @returns The total amount of the sale.
   */
  get total() {
    return this._total;
  }

}
