/**
 * Represents a batch item received from the Resource API.
 */
export interface BatchItemResponse {
  id: string;
  code: string;
  currentStock: number | {
    stock: number;
    unitMeasurement: string;
  };
  unitMeasurement?: string;
  customSupplyId: string;
  branchId: string;
  accountId: string | { value?: string; id?: string };
  expirationDate: string | null;
  entryDate: string | null;
}

/**
 * Represents the batch payload received from the Resource API.
 */
export interface BatchPayloadResponse {
  data?: BatchItemResponse[];
  batches?: BatchItemResponse[];
}

/**
 * Represents the root response received from the Resource API.
 */
export interface BatchRootResponse {
  data?: BatchItemResponse[];
  batches?: BatchItemResponse[];
  batch?: BatchPayloadResponse;
}

export interface CreateBatchRequest {
  code: string;
  currentStock: number;
  customSupplyId: string;
  branchId: string;
  expirationDate: string;
}

export interface UpdateBatchRequest {
  code: string;
  currentStock: number;
  expirationDate: string | null;
}

export interface TransferBatchRequest {
  targetBranchId: string;
  quantity: number;
  unitMeasurement: string;
  reason: string;
}
