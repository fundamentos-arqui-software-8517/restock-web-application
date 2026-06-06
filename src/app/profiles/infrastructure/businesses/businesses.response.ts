import { BaseResource, BaseResponse } from '../../../shared/infrastructure/base-response';


export interface BusinessResource extends BaseResource {
  /** Owner user id (preferred field per schema). */
  owner_id?: string;
  /** Legacy alias some mocks still return. */
  user_id?: string;
  ruc: string;
  picture_url: string;
  company_name: string;
  main_location: string;
}

/**
 * Optional list envelope when the API returns an object instead of a bare array.
 */
export interface BusinessesListResponse extends BaseResponse {
  businesses?: BusinessResource[];
}
