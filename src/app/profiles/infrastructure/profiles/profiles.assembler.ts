import { BaseAssembler } from '../../../shared/infrastructure/base-assembler';
import { Profile } from '../../domain/model/profile.entity';
import { ProfileResource, ProfilesListResponse } from './profiles.response';

export class ProfilesAssembler implements BaseAssembler<Profile, ProfileResource, ProfilesListResponse> {
  /**
   * @param response - Envelope possibly containing a `profiles` array.
   * @returns Domain entities decoded from the envelope.
   */
  toEntitiesFromResponse(response: ProfilesListResponse): Profile[] {
    const list = response.profiles;
    if (!list?.length) {
      return [];
    }
    return list.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * @param resource - Single profile document from the API.
   */
  toEntityFromResource(resource: ProfileResource): Profile {
    const profileId = resource.id ?? String(resource.id);
    return new Profile({
      profileId,
      userId: resource.user_id ?? '',
      name: resource.name ?? '',
      lastName: resource.last_name ?? '',
      phoneNumber: resource.phone_number ?? '',
      avatarUrl: resource.avatar_url ?? '',
      gender: resource.gender ?? '',
      birthDate: resource.birth_date ?? '',
    });
  }

  /**
   * @param entity - Domain aggregate to send on create/update.
   */
  toResourceFromEntity(entity: Profile): ProfileResource {
    return {
      id: entity.profileId.getValue(),
      user_id: entity.userId.getValue(),
      name: entity.name,
      last_name: entity.lastName,
      phone_number: entity.phoneNumber.getValue(),
      avatar_url: entity.avatarUrl.getValue(),
      gender: entity.gender,
      birth_date: entity.birthDate.getValue(),
    };
  }
}
