import { BaseResource } from '../../../shared/infrastructure/base-response';

export interface BusinessResource extends BaseResource {
  _id: string;
  user_id: string;
  ruc: string;
  picture_url: string;
  company_name: string;
  main_location: string;
}
