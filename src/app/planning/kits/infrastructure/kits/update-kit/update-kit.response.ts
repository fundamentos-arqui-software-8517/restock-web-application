import { BaseResource, BaseResponse } from '../../../../../shared/infrastructure/base-response';
import { KitItemEntity } from '../../../domain/model/kit-item.entity';

export interface UpdateKitResource extends BaseResource {
  id: string;
  accountId: string;
  name: string;
  description: string;
  sku: string;
  imageUrl: string;
  sellingPrice: number;
  status: string;
  type: string;
  items: {
    id: string;
    productId: string;
    customSupplyId: string;
    quantity: number;
    totalCost: number;
  }[];
}
export interface UpdateKitResponse extends BaseResponse, UpdateKitResource {}
