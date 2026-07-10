import { SalesOrderEntity } from '../../domain/model/sales-order.entity';
import { SalesOrderItemEntity } from '../../domain/model/sales-order-item.entity';
import { SalesOrderStatus } from '../../domain/model/sales-order-status.enum';
import { SalesProductType } from '../../domain/command/add-product-to-order.command';
import { SalesOrderItemResource, SalesOrderResource } from './sales.response';

export class SalesAssembler {
  toEntityFromResource(resource: SalesOrderResource): SalesOrderEntity {
    return new SalesOrderEntity({
      id: resource.id,
      branchId: resource.branchId,
      status: resource.status as SalesOrderStatus,
      items: (resource.items ?? []).map((item) => this.toItemEntityFromResource(item)),
      subtotalAmount: resource.subtotalAmount,
      taxAmount: resource.taxAmount,
      totalAmount: resource.totalAmount,
      currency: resource.currency,
      createdAt: resource.createdAt,
    });
  }

  toEntitiesFromArray(resources: SalesOrderResource[]): SalesOrderEntity[] {
    return resources.map((resource) => this.toEntityFromResource(resource));
  }

  private toItemEntityFromResource(resource: SalesOrderItemResource): SalesOrderItemEntity {
    return new SalesOrderItemEntity({
      id: resource.id,
      productId: resource.productId,
      productType: (resource.productType as SalesProductType) ?? 'KIT',
      nameSnapshot: resource.nameSnapshot,
      unitPrice: resource.unitPrice,
      quantity: resource.quantity,
      ingredientsResolved: resource.ingredientsResolved ?? [],
    });
  }
}
