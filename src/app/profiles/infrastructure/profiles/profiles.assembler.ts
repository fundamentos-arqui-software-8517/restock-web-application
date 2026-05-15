import { Injectable } from '@angular/core';
import { BaseResponse } from '../../../shared/infrastructure/base-response';
import { BaseAssembler } from '../../../shared/infrastructure/base-assembler';
import { Profile } from '../../domain/model/profile.entity';
import { ProfileResource } from './profiles.response';

@Injectable({ providedIn: 'root' })
export class ProfilesAssembler implements BaseAssembler<Profile, ProfileResource, BaseResponse> {
  toEntityFromResource(resource: ProfileResource): Profile {
    return {
      id: resource._id ?? String(resource.id),
      userId: resource.user_id ?? '',
      firstName: resource.name ?? '',
      lastName: resource.last_name ?? '',
      phone: resource.phone_number ?? '',
      avatarUrl: resource.avatar_url ?? '',
      gender: resource.gender ?? '',
      birthDate: resource.birth_date ?? '',
    };
  }

  toResourceFromEntity(entity: Profile): ProfileResource {
    return {
      id: 0,
      _id: entity.id,
      user_id: entity.userId,
      name: entity.firstName,
      last_name: entity.lastName,
      phone_number: entity.phone,
      avatar_url: entity.avatarUrl,
      gender: entity.gender,
      birth_date: entity.birthDate,
    };
  }

  toEntitiesFromResponse(_response: BaseResponse): Profile[] {
    return [];
  }
}
