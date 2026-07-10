import { RecentSale } from '../../domain/model/recent-sale.entity';
import { RecentSaleResponse } from './recent-sale.response';

export class RecentSaleAssembler {
  static toEntity(response: RecentSaleResponse): RecentSale {
    return {
      saleId: response.saleId,
      branchId: response.branchId,
      branchName: response.branchName,
      totalAmount: response.totalAmount,
      saleDate: response.saleDate,
      status: response.status,
    };
  }

  static toEntityList(responses: RecentSaleResponse[]): RecentSale[] {
    return responses.map(r => RecentSaleAssembler.toEntity(r));
  }
}

