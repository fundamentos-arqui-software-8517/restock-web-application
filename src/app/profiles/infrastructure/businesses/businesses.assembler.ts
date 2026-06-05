import { BaseAssembler } from '../../../shared/infrastructure/base-assembler';
import { Business } from '../../domain/model/business.entity';
import { BusinessResource, BusinessesListResponse } from './businesses.response';

export class BusinessesAssembler implements BaseAssembler<
  Business,
  BusinessResource,
  BusinessesListResponse
> {
  /**
   * @param response - Envelope possibly containing a `businesses` array.
   */
  toEntitiesFromResponse(response: BusinessesListResponse): Business[] {
    const list = response.businesses;
    if (!list?.length) {
      return [];
    }
    return list.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * @param resource - Single business document from the API.
   */
  toEntityFromResource(resource: BusinessResource): Business {
    const businessId = resource.id ?? String(resource.id);
    const ownerId = resource.owner_id ?? resource.user_id ?? '';

    return new Business({
      businessId,
      ownerId,
      ruc: resource.ruc ?? '',
      pictureUrl: resource.picture_url ?? '',
      companyName: resource.company_name ?? '',
      mainLocation: resource.main_location ?? '',
    });
  }

  /**
   * @param entity - Domain aggregate to send on create/update.
   */
  toResourceFromEntity(entity: Business): BusinessResource {
    return {
      id: entity.id,
      owner_id: entity.ownerId.getValue(),
      ruc: entity.ruc,
      picture_url: entity.pictureUrl.getValue(),
      company_name: entity.companyName,
      main_location: entity.mainLocation.getValue(),
    };
  }
}
