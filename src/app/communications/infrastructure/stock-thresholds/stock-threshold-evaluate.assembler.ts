import { StockThresholdAlert } from '../../domain/model/stock-threshold-alert.entity';
import { StockThresholdEvaluateResponse } from './stock-threshold-evaluate.response';

export class StockThresholdEvaluateAssembler {
  static toEntity(resource: StockThresholdEvaluateResponse): StockThresholdAlert {
    return StockThresholdAlert.create({
      customSupplyId:   resource.customSupplyId,
      customSupplyName: resource.customSupplyName,
      currentStock:     resource.currentStock,
      maxStock:         resource.maxStock,
      status:           resource.status,
      alertId:          resource.alertId,
    });
  }

  static toEntityList(resources: StockThresholdEvaluateResponse[]): StockThresholdAlert[] {
    return resources.map(r => StockThresholdEvaluateAssembler.toEntity(r));
  }
}
