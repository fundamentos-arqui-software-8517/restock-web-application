import { BaseResource, BaseResponse } from '../../../shared/infrastructure/base-response';

/**
 * Wire shape for one document in the `profiles` collection.
 */
export interface ProfileResource extends BaseResource {
  user_id: string;
  name: string;
  last_name: string;
  phone_number: string;
  avatar_url: string;
  gender: string;
  birth_date: string;
}

/**
 * Optional list envelope when the API returns an object instead of a bare array.
 */
export interface ProfilesListResponse extends BaseResponse {
  profiles?: ProfileResource[];
}
