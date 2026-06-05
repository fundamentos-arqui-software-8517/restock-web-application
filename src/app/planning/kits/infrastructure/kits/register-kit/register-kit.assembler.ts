
import { RegisterKitRequest } from './register-kit.request';
import { RegisterKitResponse } from './register-kit.response';
import { Kit } from '../../../domain/model/kit.entity';
import { KitItem } from '../../../domain/model/kit-item.entity';
import { RegisterKitCommand } from '../../../domain/command/register-kit.command';

export class RegisterKitAssembler {
  static toRequestFromCommand(command: RegisterKitCommand): RegisterKitRequest {
    return {
      name: command.name,
      price: command.price,
      description: command.description,
      imageUrl: command.imageUrl,
      items: command.items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    };
  }

  static toEntityFromResponse(response: RegisterKitResponse): Kit {
    const domainItems = response.items.map(
      (item) =>
        new KitItem({
          id: item.id,
          name: item.name,
          sku: item.sku,
          price: item.price,
          quantity: item.quantity,
        }),
    );
    return new Kit({
      id: response.id,
      name: response.name,
      sku: response.sku,
      price: response.price,
      description: response.description,
      imageUrl: response.imageUrl,
      status: response.status as any,
      items: domainItems,
    });
  }
}
