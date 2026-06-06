import { RegisterKitRequest } from './register-kit.request';
import { RegisterKitResponse } from './register-kit.response';
import { KitEntity } from '../../../domain/model/kit.entity';
import { KitItemEntity } from '../../../domain/model/kit-item.entity';
import { RegisterKitCommand } from '../../../domain/command/register-kit.command';

export class RegisterKitAssembler {
  static toRequestFromCommand(command: RegisterKitCommand): RegisterKitRequest {
    return {
      accountId: command.accountId,
      name: command.name,
      description: command.description ?? '',
      sku: command.sku,
      type: 'KIT',
      imageUrl: command.imageUrl ?? '',
      sellingPrice: command.sellingPrice,
    };
  }

  static toEntityFromResponse(response: RegisterKitResponse): KitEntity {
    const domainItems = (response.items ?? []).map(
      (item) =>
        new KitItemEntity({
          id: item.id,
          productId: item.productId,
          customSupplyId: item.customSupplyId,
          quantity: item.quantity,
          totalCost: item.totalCost,
        }),
    );
    return new KitEntity({
      id: response.id,
      accountId: response.accountId,
      name: response.name,
      description: response.description,
      sku: response.sku,
      type: response.type as KitEntity['type'],
      status: (response.status as KitEntity['status']) ?? 'ACTIVE',
      imageUrl: response.imageUrl,
      sellingPrice: response.sellingPrice,
      items: domainItems,
    });
  }
}
