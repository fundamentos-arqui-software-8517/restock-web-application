/**
 * Represents a customer in the register-sale entity.
 */
export class Customer {

  /**
   * The name of the customer.
   * @private Name is stored as a string to allow for flexibility in naming conventions.
   */
  private _name: string;

  /**
   * Initializes a new instance of the Customer class.
   * @param Customer - The customer object containing the name.
   */
  constructor(Customer: {
    name: string;
  }) {
    this._name = Customer.name;
  }

  /**
   * Getter for the name of the customer.
   * @returns The name of the customer.
   */
  get name() {
    return this._name;
  }
}
