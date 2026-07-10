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
    return new Business({
      businessId: resource.id ?? '',
      accountId: resource.accountId ?? '',
      ownerId: resource.userId ?? '',
      ruc: resource.ruc ?? '',
      pictureUrl: resource.pictureUrl ?? '',
      companyName: resource.companyName ?? '',
      mainLocation: resource.mainLocation ?? '',
    });
  }

  toResourceFromEntity(entity: Business): BusinessResource {
    return {
      accountId: entity.accountId,
      userId: entity.ownerId.getValue(),
      ruc: entity.ruc,
      pictureUrl: entity.pictureUrl.getValue(),
      companyName: entity.companyName,
      mainLocation: entity.mainLocation.getValue(),
    } as BusinessResource;
  }
}
