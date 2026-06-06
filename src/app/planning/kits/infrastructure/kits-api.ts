import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { KitEntity } from '../domain/model/kit.entity';
import { RegisterKitCommand } from '../domain/command/register-kit.command';
import { UpdateKitCommand } from '../domain/command/update-kit.command';
import { AddKitItemCommand } from '../domain/command/add-kit-item.command';
import { RemoveKitItemCommand } from '../domain/command/remove-kit-item.command';
import { DeleteKitCommand } from '../domain/command/delete-kit.command';
import { RegisterKitApiEndpoint } from './kits/register-kit/register-kit-api-endpoint';
import { UpdateKitApiEndpoint } from './kits/update-kit/update-kit-api-endpoint';
import { RemoveKitItemApiEndpoint } from './kits/remove-kit-item/remove-kit-item-api-endpoint';
import { DeleteKitApiEndpoint } from './kits/delete-kit/delete-kit-api-endpoint';
import { environment } from '../../../../environments/environment';
import { CustomSupplyEntity } from '../../recipes';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { KitItemEntity } from '../domain/model/kit-item.entity';
import { AddKitItemApiEndpoint } from './kits/add-kit-item/add-kit-item-api-endpoint';

@Injectable({ providedIn: 'root' })
export class KitsApiEndpoint {
  constructor(
    private registerService: RegisterKitApiEndpoint,
    private updateService: UpdateKitApiEndpoint,
    private addItemService: AddKitItemApiEndpoint,
    private removeItemService: RemoveKitItemApiEndpoint,
    private deleteService: DeleteKitApiEndpoint,
    private http: HttpClient,
  ) {}

  register(command: RegisterKitCommand): Observable<KitEntity> {
    return this.registerService.registerKit(command);
  }

  update(command: UpdateKitCommand): Observable<KitEntity> {
    return this.updateService.updateKit(command);
  }

  addItem(command: AddKitItemCommand): Observable<KitEntity> {
    return this.addItemService.addKitItem(command.productId, command);
  }

  removeItem(command: RemoveKitItemCommand): Observable<KitEntity> {
    return this.removeItemService.removeKitItem(command);
  }

  delete(command: DeleteKitCommand): Observable<void> {
    return this.deleteService.deleteKit(command);
  }

  getSupplies(accountId: string): Observable<CustomSupplyEntity[]> {
    const url = `${environment.platformProviderApiBaseUrl}/custom-supplies?accountId=${accountId}`;
    return this.http.get<CustomSupplyEntity[]>(url);
  }

  getAllKits(accountId: string) {
    return this.http.get<KitEntity[]>(
      `${environment.platformProviderApiBaseUrl}/products?accountId=${accountId}`,
    );
  }

  getKitById(kitId: string): Observable<KitEntity> {
    return this.http
      .get<any>(`${environment.platformProviderApiBaseUrl}/products/${kitId}`)
      .pipe(map((r) => this._mapToKitEntity(r)));
  }

  private _mapToKitEntity(r: any): KitEntity {
    return new KitEntity({
      id: r.id,
      accountId: r.accountId,
      name: r.name,
      description: r.description,
      sku: r.sku,
      type: r.type,
      status: r.status,
      imageUrl: r.imageUrl,
      sellingPrice: r.sellingPrice,
      items: (r.ingredients ?? r.items ?? []).map(
        (ing: any) =>
          new KitItemEntity({
            id: ing.id,
            productId: ing.productId,
            customSupplyId: ing.customSupplyId,
            quantity: ing.quantity,
            totalCost: ing.totalCost,
          }),
      ),
    });
  }
}
