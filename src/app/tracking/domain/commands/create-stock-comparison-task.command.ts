import { StockRecord } from '../model/records';


export interface CreateStockComparisonTaskCommand {
  deviceId: string;
  physicalStock: StockRecord;
  systemStock: StockRecord;
}
