import { SaleResource, SalesResponse } from './sales.response';
import { BaseAssembler } from '../../../shared/infrastructure/base-assembler';
import { Sale } from '../../domain/model/sale.entity';
import { Currency } from '../../../shared/domain/model/currency.entity';
import { SaleTotal } from '../../domain/model/sale-total.entity';
import { SaleStatus } from '../../domain/model/sale-status.enum';
import { Customer } from '../../domain/model/customer.entity';
import { SaleItem } from '../../domain/model/sale-item.entity';

/**
 * Assembler class responsible for converting between domain models, request objects, and response objects related to get-sale-by-branch-id.
 */
export class SalesAssembler implements BaseAssembler<Sale, SaleResource, SalesResponse> {

  private readonly currencySymbols: Record<string, string> = {
    PEN: 'S/',
    USD: '$',
    EUR: '€',
    GBP: '£',
  };

  /**
   * Maps an array of SaleResource objects to an array of Sale entities.
   * @param response - The response object containing an array of SaleResource objects.
   * @returns An array of Sale entities created from the SaleResource objects.
   */
  toEntitiesFromResponse(response: SalesResponse): Sale[] {
    return response.sales.map((saleResource) => this.toEntityFromResource(saleResource));
  }

  /**
   * Converts a SaleResource object to a Sale entity.
   * @param resource - The SaleResource object to be converted.
   * @returns The Sale entity created from the SaleResource.
   */
  toEntityFromResource(resource: SaleResource): Sale {
    const currencyCode = typeof resource.currency === 'string'
      ? resource.currency
      : resource.currency.code;
    const currencySymbol = typeof resource.currency === 'string'
      ? (this.currencySymbols[resource.currency] ?? resource.currency)
      : resource.currency.symbol;
    const customerName = typeof resource.customer === 'string'
      ? resource.customer
      : resource.customer.name;

    return new Sale({
      id: resource.id,
      businessId: resource.businessId,
      branchId: resource.branchId,
      registeredByUserId: resource.registeredByUserId,
      customer: new Customer({
        name: customerName,
      }),
      currency: new Currency({
        code: currencyCode,
        symbol: currencySymbol,
      }),
      saleItems: resource.saleItems.map(
        (item) =>
          new SaleItem({
            id: item.itemId,
            nameSnapshot: item.nameSnapshot,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            lineTotal: item.lineTotal,
            imageUrl: item.imageUrl,
          }),
      ),
      additionalSupplies: [],
      saleTotal: new SaleTotal({
        subTotal: resource.saleTotal.subTotal,
        tax: resource.saleTotal.tax,
        total: resource.saleTotal.total,
      }),
      saleStatus: resource.saleStatus as SaleStatus,
      date: resource.date,
    });
  }

  /**
   * Converts a Sale entity to a SaleResource object.
   * @param entity - The Sale entity to be converted.
   * @returns The SaleResource object created from the Sale entity.
   */
  toResourceFromEntity(entity: Sale): SaleResource {
    return {
      id: entity.id,
      businessId: entity.businessId,
      branchId: entity.branchId,
      registeredByUserId: entity.registeredByUserId,
      customer: {
        name: entity.customer.name,
      },
      currency: {
        code: entity.currency.code,
        symbol: entity.currency.symbol,
      },
      saleItems: entity.saleItems.map((item) => ({
        itemId: item.id,
        nameSnapshot: item.nameSnapshot,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        lineTotal: item.lineTotal,
      })),
      saleTotal: {
        subTotal: entity.saleTotal.subTotal,
        tax: entity.saleTotal.tax,
        total: entity.saleTotal.total,
      },
      saleStatus: entity.saleStatus,
      date: entity.date,
    } as SaleResource;
  }
}
