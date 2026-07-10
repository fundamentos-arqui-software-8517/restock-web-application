import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { SalesOrderEntity } from '../domain/model/sales-order.entity';
import { CreateSalesOrderCommand } from '../domain/command/create-sales-order.command';
import { AddProductToOrderCommand } from '../domain/command/add-product-to-order.command';
import { RemoveProductFromOrderCommand } from '../domain/command/remove-product-from-order.command';
import { SalesApiEndpoint } from './sales/sales-api-endpoint';

/**
 * Single entry point the application layer (SalesStore) talks to.
 * Hides the fact that there could be more than one endpoint/sub-resource
 * under the Sales bounded context down the line.
 */
@Injectable({ providedIn: 'root' })
export class SalesApi extends BaseApi {
  private readonly salesOrdersEndpoint: SalesApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.salesOrdersEndpoint = new SalesApiEndpoint(http);
  }

  getOrdersByAccount(accountId: string): Observable<SalesOrderEntity[]> {
    return this.salesOrdersEndpoint.getOrdersByAccount(accountId);
  }

  getOrderById(orderId: string): Observable<SalesOrderEntity> {
    return this.salesOrdersEndpoint.getOrderById(orderId);
  }

  createOrder(accountId: string, command: CreateSalesOrderCommand): Observable<SalesOrderEntity> {
    return this.salesOrdersEndpoint.create(accountId, command);
  }

  addItem(command: AddProductToOrderCommand): Observable<SalesOrderEntity> {
    return this.salesOrdersEndpoint.addItem(command);
  }

  removeItem(command: RemoveProductFromOrderCommand): Observable<SalesOrderEntity> {
    return this.salesOrdersEndpoint.removeItem(command);
  }

  completeOrder(orderId: string, accountId?: string): Observable<SalesOrderEntity> {
    return this.salesOrdersEndpoint.complete(orderId, accountId);
  }

  cancelOrder(orderId: string): Observable<SalesOrderEntity> {
    return this.salesOrdersEndpoint.cancel(orderId);
  }
}
