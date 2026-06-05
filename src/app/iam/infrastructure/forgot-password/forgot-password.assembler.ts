import { ForgotPasswordCommand } from '../../domain/model/forgot-password.command';
import { ForgotPasswordRequest } from './forgot-password.request';

/**
 * Mapper between Forgot Password command and infrastructure request contracts.
 */
export class ForgotPasswordAssembler {
  /**
   * Maps a ForgotPasswordCommand to a ForgotPasswordRequest for the API.
   * @param command - The domain command.
   * @returns The infrastructure request.
   */
  static toRequestFromCommand(command: ForgotPasswordCommand): ForgotPasswordRequest {
    return {
      email: command.email,
    };
  }
}
