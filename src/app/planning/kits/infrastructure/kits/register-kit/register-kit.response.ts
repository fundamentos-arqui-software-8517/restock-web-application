import { BaseResource, BaseResponse } from '../../../../../shared/infrastructure/base-response';


export interface RegisterKitResource extends BaseResource {
  id: string;
  name: string;
  sku: string;
  price: number;
  description: string;
  imageUrl: string;
  status: string;
  items: Array<{ id: string; name: string; sku: string; price: number; quantity: number }>;
}
export interface RegisterKitResponse extends BaseResponse, RegisterKitResource {}
