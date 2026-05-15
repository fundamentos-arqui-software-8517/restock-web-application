import { Injectable } from '@angular/core';
import { BaseResponse } from '../../../shared/infrastructure/base-response';
import { BaseAssembler } from '../../../shared/infrastructure/base-assembler';
import { Business } from '../../domain/model/business.entity';
import { BusinessResource } from './businesses.response';

@Injectable({ providedIn: 'root' })
export class BusinessesAssembler implements BaseAssembler<Business, BusinessResource, BaseResponse> {
  toEntityFromResource(resource: BusinessResource): Business {
    return {
      id: resource._id ?? String(resource.id),
      userId: resource.user_id ?? '',
      ruc: resource.ruc ?? '',
      pictureUrl: resource.picture_url ?? '',
      companyName: resource.company_name ?? '',
      mainLocation: resource.main_location ?? '',
    };
  }

  toResourceFromEntity(entity: Business): BusinessResource {
    return {
      id: 0,
      _id: entity.id,
      user_id: entity.userId,
      ruc: entity.ruc,
      picture_url: entity.pictureUrl,
      company_name: entity.companyName,
      main_location: entity.mainLocation,
    };
  }

  toEntitiesFromResponse(_response: BaseResponse): Business[] {
    return [];
  }
}
