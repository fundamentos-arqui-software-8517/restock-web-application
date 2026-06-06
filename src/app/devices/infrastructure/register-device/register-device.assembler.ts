import { RegisterDeviceCommand } from '../../domain/model/register-device.command';
import { RegisterDeviceRequest } from './register-device.request';

export class RegisterDeviceAssembler {
  toRequestFromCommand(command: RegisterDeviceCommand): RegisterDeviceRequest {
    return {
      macAddress: command.macAddress,
      description: command.description,
    };
  }
}
