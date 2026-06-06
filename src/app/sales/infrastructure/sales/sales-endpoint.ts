import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { SalesAssembler } from './sales.assembler';
import { SaleResource, SalesResponse } from './sales.response';
import { BaseApiEndpoint } from '../../../shared/infrastructure/base-api-endpoint';
import { Sale } from '../../domain/model/sale.entity';
import { map, Observable } from 'rxjs';


const salesApiEndpointUrl = `${environment.salesAPI.salesBaseUrl}/${environment.platformProviderSalesEndpointsPath}`;

/**
 * Sales API endpoint class responsible for handling HTTP requests and responses related to getting sales by branch id.
 * Extends the ErrorHandlingEnabledBaseType to include error handling functionality.
 */
export class SalesApiEndpoint extends BaseApiEndpoint<
  Sale,
  SaleResource,
  SalesResponse,
  SalesAssembler
> {
  /**
   * Constructor for SalesApiEndpoint.
   * @param http - The HttpClient instance for making HTTP requests.
   */
  constructor(http: HttpClient) {
    super(http, salesApiEndpointUrl, new SalesAssembler());
  }

  /**
   * Retrieves sales by branch id from the API endpoint.
   * @param branchId - The id of the branch for which to retrieve sales.
   * @returns An Observable that emits an array of Sale entities.
   */
  getSalesByBranchId(branchId: string): Observable<Sale[]> {
    return this.http
      .get<SaleResource[]>(this.endpointUrl, {
        params: { branchId },
      })
      .pipe(
        map((response) =>
          response.map((resource) => this.assembler.toEntityFromResource(resource)),
        ),
      );
  }
}
