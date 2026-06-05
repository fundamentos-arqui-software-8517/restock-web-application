import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Kit } from '../domain/model/kit.entity';
import { KitsApiEndpoint } from './kits/kits-api-endpoint';
import { RegisterKitApiEndpoint } from './kits/register-kit/register-kit-api-endpoint';
import { UpdateKitApiEndpoint } from './kits/update-kit/update-kit-api-endpoint';
import { KitItem } from '../domain/model/kit-item.entity';
import { BaseApi } from '../../../shared/infrastructure/base-api';
import { ProductsApiEndpoint } from './products-api';
import { RegisterKitCommand } from '../domain/command/register-kit.command';
import { UpdateKitCommand } from '../domain/command/update-kit.command';

/**
 * Infrastructure Context Facade for Kits management.
 * Acts as a single entry point for all network/API interactions regarding the Kits context,
 * abstracting individual specialized endpoints from the application layer.
 */
@Injectable({
  providedIn: 'root',
})
export class KitsApi extends BaseApi {
  private readonly kitsEndpoint = inject(KitsApiEndpoint);
  private readonly registerEndpoint = inject(RegisterKitApiEndpoint);
  private readonly updateEndpoint = inject(UpdateKitApiEndpoint);
  private readonly productsEndpoint = inject(ProductsApiEndpoint);
  /**
   * Retrieves the complete collection of kits for the catalog view.
   * Delegates the operation to the general Kits query endpoint (GET).
   * * @returns An Observable array of domain Kit entities.
   */
  getAllKits(): Observable<Kit[]> {
    return this.kitsEndpoint.getAllKits();
  }

  /**
   * Dispatches a command to register a brand new kit configuration.
   * Delegates the operation to the specialized registration endpoint (POST).
   * * @param command The semantic intent containing the new kit details and items.
   * @returns An Observable of the newly created domain Kit entity.
   */
  registerKit(command: RegisterKitCommand): Observable<Kit> {
    return this.registerEndpoint.registerKit(command);
  }

  /**
   * Dispatches a command to update an explicit existing kit contract.
   * Delegates the operation to the specialized update endpoint (PUT).
   * * @param command The semantic intent containing the target ID and modified attributes.
   * @returns An Observable of the updated domain Kit entity.
   */
  updateKit(command: UpdateKitCommand): Observable<Kit> {
    return this.updateEndpoint.updateKit(command);
  }

  getAllProducts(): Observable<KitItem[]> {
    return this.productsEndpoint.getAllProducts().pipe(
      map((jsonArray) =>
        jsonArray.map(
          (json) =>
            new KitItem({
              id: json.id,
              name: json.name,
              sku: json.sku,
              price: json.price,
              quantity: json.quantity,
            }),
        ),
      ),
    );
  }
}
