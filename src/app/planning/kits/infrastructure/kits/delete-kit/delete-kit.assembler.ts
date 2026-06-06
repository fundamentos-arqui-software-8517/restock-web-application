import { DeleteKitCommand } from '../../../domain/command/delete-kit.command';

export class DeleteKitAssembler {
  static toPathParams(command: DeleteKitCommand): string {
    return command.id;
  }
}
