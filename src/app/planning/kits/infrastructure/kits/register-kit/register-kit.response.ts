import { BaseResource, BaseResponse } from '../../../../../shared/infrastructure/base-response';
import { KitItemEntity } from '../../../domain/model/kit-item.entity';

export interface RegisterKitResource extends BaseResource {
  id: string;
  accountId: string;
  name: string;
  description: string;
  sku: string;
  type: string;
  status: string;
  imageUrl: string;
  sellingPrice: number;
  items: KitItemEntity[];
}
export interface RegisterKitResponse extends BaseResponse, RegisterKitResource {}
