import { BaseResource, BaseResponse } from '../../../shared/infrastructure/base-response';


export interface BusinessResource extends BaseResource {
  accountId?: string;
  userId: string;
  ruc: string;
  pictureUrl: string;
  picturePublicId?: string | null;
  companyName: string;
  mainLocation: string;
}

/**
 * Optional list envelope when the API returns an object instead of a bare array.
 */
export interface BusinessesListResponse extends BaseResponse {
  businesses?: BusinessResource[];
}
