import { BaseResource, BaseResponse } from '../../../shared/infrastructure/base-response';

/**
 * Wire shape for one document in the `profiles` collection.
 */
export interface ProfileResource extends BaseResource {
  accountId?: string;
  userId: string;
  name: string;
  lastName: string;
  phoneNumber: string;
  avatarUrl: string;
  avatarPublicId?: string | null;
  gender: string;
  birthDate: string;
}

/**
 * Optional list envelope when the API returns an object instead of a bare array.
 */
export interface ProfilesListResponse extends BaseResponse {
  profiles?: ProfileResource[];
}
