import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ErrorHandlingEnabledBaseType } from '../../../shared/infrastructure/error-handling-enabled-base-type';
import { SalesOrderEntity } from '../../domain/model/sales-order.entity';
import { CreateSalesOrderCommand } from '../../domain/command/create-sales-order.command';
import { AddProductToOrderCommand } from '../../domain/command/add-product-to-order.command';
import { RemoveProductFromOrderCommand } from '../../domain/command/remove-product-from-order.command';
import { SalesAssembler } from './sales.assembler';
import { InsufficientStockErrorResource, SalesOrderResource } from './sales.response';
import { InsufficientStockHttpError } from './insufficient-stock.error';

/**
 * HTTP client for the Sales bounded context (/api/v1/sales-orders).
 * Only this layer talks to Angular's HttpClient; the store never does.
 */
export class SalesApiEndpoint extends ErrorHandlingEnabledBaseType {
  private readonly assembler = new SalesAssembler();
  private readonly baseUrl = `${environment.baseUrl}/sales-orders`;

  constructor(private readonly http: HttpClient) {
    super();
  }

  getOrdersByAccount(accountId: string): Observable<SalesOrderEntity[]> {
    return this.http.get<SalesOrderResource[]>(this.baseUrl, { params: { accountId } }).pipe(
      map((resources) => this.assembler.toEntitiesFromArray(resources)),
      catchError(this.handleError('Failed to load sales orders')),
    );
  }

  getOrderById(orderId: string): Observable<SalesOrderEntity> {
    return this.http.get<SalesOrderResource>(`${this.baseUrl}/${orderId}`).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to load sales order')),
    );
  }

  create(accountId: string, command: CreateSalesOrderCommand): Observable<SalesOrderEntity> {
    return this.http
      .post<SalesOrderResource>(
        this.baseUrl,
        { branchId: command.branchId },
        { params: { accountId } },
      )
      .pipe(
        map((resource) => this.assembler.toEntityFromResource(resource)),
        catchError(this.handleError('Failed to create sales order')),
      );
  }

  addItem(command: AddProductToOrderCommand): Observable<SalesOrderEntity> {
    return this.http
      .post<SalesOrderResource>(`${this.baseUrl}/${command.orderId}/items`, {
        productId: command.productId,
        productType: command.productType,
        nameSnapshot: command.nameSnapshot,
        unitPrice: command.unitPrice,
        currency: command.currency,
        quantity: command.quantity,
      })
      .pipe(
        map((resource) => this.assembler.toEntityFromResource(resource)),
        catchError(this.handleError('Failed to add product to order')),
      );
  }

  removeItem(command: RemoveProductFromOrderCommand): Observable<SalesOrderEntity> {
    return this.http
      .delete<SalesOrderResource>(`${this.baseUrl}/${command.orderId}/items/${command.itemId}`)
      .pipe(
        map((resource) => this.assembler.toEntityFromResource(resource)),
        catchError(this.handleError('Failed to remove product from order')),
      );
  }

  /**
   * Completes ("logs") the sale. Needs bespoke error handling: a 422 here
   * carries the structured insufficient-stock payload, which the generic
   * handleError() would otherwise flatten into a plain string and lose.
   */
  complete(orderId: string, accountId?: string): Observable<SalesOrderEntity> {
    const params = accountId ? { accountId } : undefined;
    return this.http
      .patch<SalesOrderResource>(
        `${this.baseUrl}/${orderId}/status`,
        { status: 'COMPLETED' },
        { params },
      )
      .pipe(
        map((resource) => this.assembler.toEntityFromResource(resource)),
        catchError((error: HttpErrorResponse) => {
          const body = error.error as InsufficientStockErrorResource | undefined;
          if (error.status === 422 && body?.customSupplyId) {
            return throwError(() => new InsufficientStockHttpError(body));
          }
          return this.handleError('Failed to complete sales order')(error);
        }),
      );
  }

  cancel(orderId: string): Observable<SalesOrderEntity> {
    return this.http
      .patch<SalesOrderResource>(`${this.baseUrl}/${orderId}/status`, { status: 'CANCELLED' })
      .pipe(
        map((resource) => this.assembler.toEntityFromResource(resource)),
        catchError(this.handleError('Failed to cancel sales order')),
      );
  }
}
