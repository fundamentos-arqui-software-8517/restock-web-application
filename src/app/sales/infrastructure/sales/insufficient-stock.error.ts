import { InsufficientStockError } from '../../domain/model/insufficient-stock-error.model';
import { InsufficientStockErrorResource } from './sales.response';

/**
 * Thrown instead of a generic Error when the backend responds 422 with a
 * structured insufficient-stock payload, so the store/view can render the
 * "Action Blocked: Insufficient Physical Inventory" modal with real data
 * instead of a flat error string.
 */
export class InsufficientStockHttpError extends Error {
  readonly details: InsufficientStockError;

  constructor(resource: InsufficientStockErrorResource) {
    super(resource.message);
    this.name = 'InsufficientStockHttpError';
    this.details = {
      customSupplyId: resource.customSupplyId,
      supplyName: resource.supplyName,
      quantityNeeded: resource.quantityNeeded,
      quantityAvailable: resource.quantityAvailable,
      message: resource.message,
    };
  }
}
