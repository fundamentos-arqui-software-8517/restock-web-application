import { AddKitItemRequest } from './add-kit-item.request';
import { AddKitItemCommand } from '../../../domain/command/add-kit-item.command';

export class AddKitItemAssembler {
  static toRequestFromCommand(command: AddKitItemCommand): AddKitItemRequest {
    return {
      customSupplyId: command.customSupplyId,
      quantity: command.quantity,
    };
  }
}
