export interface CustomSupplyResponse {
  id: string;
  supplyId?: string;
  supply?: {
    id: string;
    name: string;
    description: string;
    category: string;
    isPerishable: boolean;
  };
  isPerishable?: boolean;
  supplyIsPerishable?: boolean;
  name: string;
  description: string;
  categoryName: string;
  unitPriceAmount: string;
  unitPriceCurrencyCode: string;
  unitMeasurement: string;
  minimumStock?: number;
  maximumStock?: number;
  pictureUrl: string;
  accountId?: string;
}

export interface AccountCustomSuppliesResponse {
  accountId: string;
  totalSupplies: number;
  supplies: CustomSupplyResponse[];
}

export interface CustomSupplyRequest {
  accountId: string;
  supplyId: string;
  name: string;
  description: string;
  categoryName: string;
  unitPrice: string;
  unitMeasurement: string;
  minimumStock: number;
  maximumStock: number;
  image?: File;
}

export type CustomSupplyListResponse = CustomSupplyResponse[];
