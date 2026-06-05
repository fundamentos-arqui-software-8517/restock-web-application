import { BaseResource } from '../../../shared/infrastructure/base-response';

// ── PRODUCT / RECIPE ──────────────────────────────────────────────────────────

/** Maps IngredientResource from OpenAPI */
export interface IngredientEntryResource {
  id: string;
  productId: string;
  customSupplyId: string;
  quantity: number;
  totalCost: number;
}

/** Maps ProductResource from OpenAPI */
export interface ProductResource extends BaseResource {
  accountId: string;
  name: string;
  description: string;
  sku: string;
  type: string;
  status: string;
  imageUrl: string;
  sellingPrice: number;
  ingredients: IngredientEntryResource[];
}

// ── CUSTOM SUPPLY ─────────────────────────────────────────────────────────────

/** Maps CustomSupplyResource from OpenAPI */
export interface CustomSupplyResource extends BaseResource {
  name: string;
  description: string;
  supplyId: string;
  supplyName: string;
  categoryName: string;
  /** e.g. "10.00" */
  unitPriceAmount: string;
  /** e.g. "PEN" */
  unitPriceCurrencyCode: string;
  unitMeasurement: string;
  minimumStock: number;
  maximumStock: number;
  pictureUrl: string;
  accountId: string;
  createdAt: string;
}

// ── REQUEST BODIES ────────────────────────────────────────────────────────────

export interface CreateProductBody {
  accountId: string;
  name: string;
  description?: string;
  sku: string;
  type: string;
  imageUrl?: string;
  sellingPrice: number;
}

export interface UpdateProductBody {
  name?: string;
  description?: string;
  sku?: string;
  imageUrl?: string;
  sellingPrice?: number;
}

export interface AddIngredientBody {
  customSupplyId: string;
  quantity: number;
}
