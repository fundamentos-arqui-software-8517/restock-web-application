import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseApi } from '../../shared/infrastructure/base-api';
import {
  SalesApiEndpoint,
} from './sales/sales-endpoint';

/**
 * Api service for register-sale operations.
 * Handles HTTP requests and responses related to register-sale operations.
 */
@Injectable({ providedIn: 'root' })
export class SalesApi extends BaseApi {


  private readonly salesApiEndpoint: SalesApiEndpoint;

  /**
   * Constructor for SalesApi.
   * @param http - HttpClient instance for making HTTP requests.
   * @private Constructor for SalesApi.
   */
  constructor(http: HttpClient) {
    super();
    this.salesApiEndpoint = new SalesApiEndpoint(http);
  }

  /**
   * Retrieves sales by branch id from the API endpoint.
   * @param branchId - The id of the branch for which to retrieve sales.
   * @returns An Observable that emits an array of Sale entities.
   */
  getSalesByBranchId(branchId: string) {
    return this.salesApiEndpoint.getSalesByBranchId(branchId);
  }
}
