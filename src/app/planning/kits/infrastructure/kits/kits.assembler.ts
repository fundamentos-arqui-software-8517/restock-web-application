import { Kit } from '../../domain/model/kit.entity';
import { KitItem } from '../../domain/model/kit-item.entity';
import { KitResponse } from './kits.response';

/**
 * Mapper dedicated to translating infrastructure query contracts into Domain entities.
 */
export class KitAssembler {
  /**
   * Maps an API KitResponse into a complete Domain Kit aggregate root,
   * initializing all its nested KitItem entities.
   */
  static toEntityFromResponse(response: KitResponse): Kit {
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
      sku: response.sku || response.id,
      price: response.price,
      description: response.description,
      imageUrl: response.imageUrl,
      status: response.status.toUpperCase() as any,
      items: domainItems,
    });
  }
}
