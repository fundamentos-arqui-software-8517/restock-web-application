import { User } from '../../domain/model/user.entity';
import { SignInCommand } from '../../domain/model/sign-in.command';
import { SignInRequest } from './sign-in.request';
import { SignInResponse } from './sign-in.response';

export class SignInAssembler {
  /**
   * Maps a SignInCommand to a SignInRequest for the API.
   */
  static toRequestFromCommand(command: SignInCommand): SignInRequest {
    return {
      email: command.email,
      password: command.password,
    };
  }

  /**
   * Maps a SignInResponse to a User domain entity.
   */
  static toEntityFromResponse(response: SignInResponse): User {
    return new User({
      id: response.id,
      accountId: response.accountId,
      email: response.email,
      roleId: response.role,
      plan: 'FREE',
      status: 'ACTIVE',
      token: response.token,
    });
  }
}
