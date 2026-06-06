import { UpdateKitRequest } from './update-kit.request';
import { UpdateKitResponse } from './update-kit.response';
import { KitEntity } from '../../../domain/model/kit.entity';
import { KitItemEntity } from '../../../domain/model/kit-item.entity';
import { UpdateKitCommand } from '../../../domain/command/update-kit.command';

export class UpdateKitAssembler {
  static toRequestFromCommand(command: UpdateKitCommand): UpdateKitRequest {
    return {
      name: command.name ?? '',
      description: command.description ?? '',
      sku: command.sku ?? '',
      imageUrl: command.imageUrl ?? '',
      sellingPrice: command.sellingPrice ?? 0,
    };
  }

  static toEntityFromResponse(response: UpdateKitResponse): KitEntity {
    return new KitEntity({
      id: response.id,
      name: response.name,
      sku: response.sku,
      sellingPrice: response.sellingPrice,
      description: response.description,
      imageUrl: response.imageUrl,
      status: response.status as any,
      items: (response.items ?? []).map(
        // ← cambiar items por ingredients
        (ing) =>
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
