import type { BatchItemResponse, BatchRootResponse } from './batch.response';
import { Batch } from '../../domain/model/batch.entity';
import type { CustomSupply } from '../../domain/model/custom-supply.entity';

/**
 * Represents a batch row ready to be consumed by the resource screen.
 *
 * This is not a domain entity. It is an assembled read model used to display
 * batch information in the frontend.
 */
export class BatchRow {
  constructor(
    public readonly id: string,
    public readonly supplyName: string,
    public readonly subtitle: string | null,
    public readonly category: string,
    public readonly uomLabel: string,
    public readonly expirationDate: string | null,
    public readonly stock: number,
    public readonly isPerishable: boolean,
    public readonly perishableBadgeTone: 'neutral' | 'warning' | 'info',
    public readonly rowHighlight: 'warning' | null,
    public readonly minStock: number,
    public readonly maxStock: number,
    public readonly code: string,
    public readonly customSupplyId: string,
    public readonly branchId: string,
  ) {}
}

/**
 * Represents assembled batch data for the resource feature.
 */
export class BatchData {
  constructor(
    public readonly totalActiveBatches: number,
    public readonly totalActiveBatchesDeltaPercent: number,
    public readonly nearExpiry30Days: number,
    public readonly batches: BatchRow[],
  ) {}
}

/**
 * Assembles a batch item response into a frontend read model row.
 *
 * @param dto Batch item received from the API.
 * @returns A batch row.
 */
function accountIdFrom(dto: BatchItemResponse): string {
  if (typeof dto.accountId === 'string') return dto.accountId;

  return dto.accountId?.value ?? dto.accountId?.id ?? '';
}

export function assembleBatchEntity(dto: BatchItemResponse, customSupply?: CustomSupply): Batch {
  const currentStock = typeof dto.currentStock === 'number'
    ? {
        stock: dto.currentStock,
        unitMeasurement: dto.unitMeasurement ?? customSupply?.unit.abbreviation ?? '',
      }
    : dto.currentStock;

  return Batch.create(
    dto.id,
    dto.code,
    currentStock,
    dto.customSupplyId,
    dto.branchId,
    accountIdFrom(dto),
    dto.expirationDate,
    dto.entryDate,
    customSupply,
  );
}

function perishableBadgeTone(batch: Batch): 'neutral' | 'warning' | 'info' {
  if (!batch.isPerishable()) return 'neutral';
  if (batch.isExpired()) return 'warning';

  return 'info';
}

function isNearExpiry(batch: Batch): boolean {
  if (!batch.expirationDate) return false;

  const expiration = new Date(batch.expirationDate);
  const today = new Date();
  const thirtyDays = new Date(today);
  today.setHours(0, 0, 0, 0);
  thirtyDays.setDate(today.getDate() + 30);
  thirtyDays.setHours(0, 0, 0, 0);
  expiration.setHours(0, 0, 0, 0);

  return expiration >= today && expiration <= thirtyDays;
}

function assembleRow(batch: Batch): BatchRow {
  const supply = batch.customSupply;
  const supplyName = supply?.name ?? batch.customSupplyId;
  const minStock = supply?.minStock ?? 0;
  const maxStock = supply?.maxStock ?? Number.MAX_SAFE_INTEGER;
  const badgeTone = perishableBadgeTone(batch);
  const rowHighlight = batch.isExpired() || isNearExpiry(batch) || batch.currentQuantity < minStock
    ? 'warning'
    : null;

  return new BatchRow(
    batch.id,
    supplyName,
    batch.code,
    supply?.category ?? '',
    batch.unitMeasurement,
    batch.expirationDate,
    batch.currentQuantity,
    batch.isPerishable(),
    badgeTone,
    rowHighlight,
    minStock,
    maxStock,
    batch.code,
    batch.customSupplyId,
    batch.branchId,
  );
}

function batchItemsFrom(root: BatchRootResponse | BatchItemResponse[]): BatchItemResponse[] {
  if (Array.isArray(root)) return root;

  return root.data ?? root.batches ?? root.batch?.data ?? root.batch?.batches ?? [];
}

/**
 * Assembles the batch root response into frontend-ready data.
 *
 * @param root Root response received from the API.
 * @returns Assembled batch data.
 */
export function assembleBatch(
  root: BatchRootResponse | BatchItemResponse[],
  customSupplies: CustomSupply[] = [],
): BatchData {
  const entities = batchItemsFrom(root).map((dto) => {
    const supply = customSupplies.find((item) => item.id === dto.customSupplyId);
    return assembleBatchEntity(dto, supply);
  });

  return new BatchData(
    entities.length,
    0,
    entities.filter(isNearExpiry).length,
    entities.map(assembleRow),
  );
}
