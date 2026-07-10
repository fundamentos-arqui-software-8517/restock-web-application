export interface CriticalProduct {
  productId: string;
  productName: string;
  supplyId: string;
  description: string;
  totalStock: number;
  minStock: number;
  maxStock: number;
  stockDeficit: number;
  branchName: string;
  branchId: string;
  unitMeasurement: string;
}

