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
    return new Profile({
      profileId: resource.id ?? '',
      userId: resource.userId ?? '',
      accountId: resource.accountId ?? '',
      name: resource.name ?? '',
      lastName: resource.lastName ?? '',
      phoneNumber: resource.phoneNumber ?? '',
      avatarUrl: resource.avatarUrl ?? '',
      gender: resource.gender ?? '',
      birthDate: resource.birthDate ?? '',
    });
  }

  toResourceFromEntity(entity: Profile): ProfileResource {
    return {
      accountId: entity.accountId,
      userId: entity.userId.getValue(),
      name: entity.name,
      lastName: entity.lastName,
      phoneNumber: entity.phoneNumber.getValue(),
      avatarUrl: entity.avatarUrl.getValue() || 'https://placehold.co/150',
      gender: entity.gender,
      birthDate: entity.birthDate.getValue(),
    } as ProfileResource;
  }
}
