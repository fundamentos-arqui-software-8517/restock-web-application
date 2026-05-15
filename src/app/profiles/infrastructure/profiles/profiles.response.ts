import { BaseResource } from '../../../shared/infrastructure/base-response';

export interface ProfileResource extends BaseResource {
  _id: string;
  user_id: string;
  name: string;
  last_name: string;
  phone_number: string;
  avatar_url: string;
  gender: string;
  birth_date: string;
}
