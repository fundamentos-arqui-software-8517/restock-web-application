import { RemoveKitItemCommand } from '../../../domain/command/remove-kit-item.command';

export class RemoveKitAssembler {
  static toPathParams(command: RemoveKitItemCommand): {
    productId: string;
    customSupplyId: string;
  } {
    return {
      productId: command.productId,
      customSupplyId: command.customSupplyId,
    };
  }
}
