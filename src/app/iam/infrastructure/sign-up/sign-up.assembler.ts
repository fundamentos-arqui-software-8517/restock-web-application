import { SignUpCommand } from '../../domain/model/sign-up.command';
import { User } from '../../domain/model/user.entity';
import { SignUpRequest } from './sign-up.request';
import { SignUpResponse } from './sign-up.response';

/**
 * Mapper between IAM command/request/response contracts and domain entities.
 */
export class SignUpAssembler {
  static toRequestFromCommand(command: SignUpCommand): SignUpRequest {
    return {
      businessName: command.businessName,
      email: command.email,
      password: command.password ?? '',
      role: command.role ?? '',
    };
  }

  static toEntityFromResponse(response: SignUpResponse): User {
    return new User({
      id: response.id,
      accountId: response.accountId,
      email: response.email,
      roleId: response.role,
      plan: 'FREE',
      status: 'ACTIVE',
      token: undefined,
    });
  }
}
