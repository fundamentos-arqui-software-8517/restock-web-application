import { StockDiscrepancy } from '../../domain/model/stock-discrepancy.entity';
import { StockDiscrepancyResponse } from './stock-discrepancy.response';

export class StockDiscrepancyAssembler {
  static toEntity(response: StockDiscrepancyResponse): StockDiscrepancy {
    return {
      discrepancyId: response.discrepancyId,
      physicalStock: response.physicalStock,
      systemStock: response.systemStock,
      difference: response.difference,
      riskLevel: response.riskLevel as StockDiscrepancy['riskLevel'],
      status: response.status as StockDiscrepancy['status'],
      isConciliated: response.isConciliated,
    };
  }

  static toEntityList(responses: StockDiscrepancyResponse[]): StockDiscrepancy[] {
    return responses.map(r => StockDiscrepancyAssembler.toEntity(r));
  }
}

