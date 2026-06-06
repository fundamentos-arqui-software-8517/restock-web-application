import { Currency } from '../../../shared/domain/model/currency.entity';
import { SaleItem } from './sale-item.entity';
import { AdditionalSupply } from './additional-supply.entity';
import { Customer } from './customer.entity';

/**
 * Command to register a sale.
 * Contains the businessId, branchId, customerName, registeredByUserId, currency, listOfItems, and additionalSupplies.
 */
export class RegisterSaleCommand {

  /**
   * Gets the unique identifier of the business.
   * @returns The unique identifier of the business.
   */
  get businessId() : string {
    return this.businessId;
  }

  /**
   * Sets the unique identifier of the business.
   * @param businessId - The unique identifier of the business.
   */
  set businessId (businessId: string) {
    this.businessId = businessId;
  }

  /**
   * Gets the unique identifier of the branch.
   * @returns The unique identifier of the branch.
   */
  get branchId() : string {
    return this.branchId;
  }

  /**
   * Sets the unique identifier of the branch.
   * @param branchId - The unique identifier of the branch.
   */
  set branchId (branchId: string) {
    this.branchId = branchId;
  }

  /**
   * Gets the unique identifier of the user who registered the sale.
   * @returns The unique identifier of the user who registered the sale.
   */
  get registeredByUserId() : string {
    return this.registeredByUserId;
  }

  /**
   * Sets the unique identifier of the user who registered the sale.
   * @param registeredByUserId - The unique identifier of the user who registered the sale.
   */
  set registeredByUserId (registeredByUserId: string) {
    this.registeredByUserId = registeredByUserId;
  }

  /**
   * Gets the name of the customer.
   * @returns The name of the customer.
   */
  get customerName() : Customer {
    return this.customerName;
  }

  /**
   * Sets the name of the customer.
   * @param customerName - The name of the customer.
   */
  set customerName (customerName: Customer) {
    this.customerName = customerName;
  }

  /**
   * Gets the currency of the sale.
   * @returns The currency of the sale.
   */
  get currency() : Currency {
    return this.currency;
  }

  /**
   * Sets the currency of the sale.
   * @param currency - The currency of the sale.
   */
  set currency (currency: Currency) {
    this.currency = currency;
  }

  /**
   * Gets the list of items in the sale.
   * @returns The list of items in the sale.
   */
  get listOfItems() : SaleItem[] {
    return this.listOfItems;
  }

  /**
   * Sets the list of items in the sale.
   * @param listOfItems - The list of items in the sale.
   */
  set listOfItems (listOfItems: SaleItem[]) {
    this.listOfItems = listOfItems;
  }

  /**
   * Gets the additional supplies in the sale.
   * @returns The additional supplies in the sale.
   */
  get additionalSupplies() : AdditionalSupply[] {
    return this.additionalSupplies;
  }

  /**
   * Sets the additional supplies in the sale.
   * @param additionalSupplies - The additional supplies in the sale.
   */
  set additionalSupplies (additionalSupplies: AdditionalSupply[]) {
    this.additionalSupplies = additionalSupplies;
  }

  /**
   * The unique identifier of the business.
   * @private Id is stored as a string to allow for flexibility in naming conventions.
   */
  private _businessId: string;

  /**
   * The unique identifier of the branch.
   * @private Id is stored as a string to allow for flexibility in naming conventions.
   */
  private _branchId: string;

  /**
   * The unique identifier of the user who registered the sale.
   * @private Id is stored as a string to allow for flexibility in naming conventions.
   */
  private _registeredByUserId: string;

  /**
   * The name of the customer.
   * @private Name is stored as a string to allow for flexibility in naming conventions.
   */
  private _customerName: Customer;

  /**
   * The currency of the sale.
   * @private Currency is stored as a Currency object.
   */
  private _currency: Currency;

  /**
   * The list of items in the sale.
   * @private SaleItems is stored as an array of SaleItem objects.
   */
  private _listOfItems: SaleItem[];

  /**
   * The additional supplies in the sale.
   * @private AdditionalSupplies is stored as an array of AdditionalSupply objects.
   */
  private _additionalSupplies: AdditionalSupply[];

  /**
   * Initializes a new instance of the RegisterSaleCommand class.
   * @param resource - The resource containing the businessId, branchId, customerName, registeredByUserId, currency, listOfItems, and additionalSupplies.
   */
  constructor(resource: {
    businessId: string;
    branchId: string;
    customerName: Customer;
    registeredByUserId: string;
    currency: Currency;
    listOfItems: SaleItem[];
    additionalSupplies: AdditionalSupply[];
  }) {
    this._businessId = resource.businessId;
    this._branchId = resource.branchId;
    this._customerName = resource.customerName;
    this._registeredByUserId = resource.registeredByUserId;
    this._currency = resource.currency;
    this._listOfItems = resource.listOfItems;
    this._additionalSupplies = resource.additionalSupplies;
  }
}
