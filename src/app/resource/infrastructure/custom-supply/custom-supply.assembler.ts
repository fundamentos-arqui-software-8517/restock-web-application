import { CustomSupplyResponse } from './custom-supply.response';
import { CustomSupply } from '../../domain/model/custom-supply.entity';
import { Supply } from '../../domain/model/supply.entity';
import { UnitMeasure } from '../../domain/model/unit-measure.entity';

const UNIT_LABELS: Record<string, { name: string; abbreviation: string }> = {
  kg: { name: 'Kilograms', abbreviation: 'kg' },
  kilogram: { name: 'Kilograms', abbreviation: 'kg' },
  kilograms: { name: 'Kilograms', abbreviation: 'kg' },
  l: { name: 'Liters', abbreviation: 'L' },
  liter: { name: 'Liters', abbreviation: 'L' },
  liters: { name: 'Liters', abbreviation: 'L' },
  doz: { name: 'Dozen', abbreviation: 'doz' },
  dozen: { name: 'Dozen', abbreviation: 'doz' },
  g: { name: 'Grams', abbreviation: 'g' },
  gram: { name: 'Grams', abbreviation: 'g' },
  grams: { name: 'Grams', abbreviation: 'g' },
  unit: { name: 'Units', abbreviation: 'units' },
  units: { name: 'Units', abbreviation: 'units' },
};

function assembleUnitMeasure(value: string): UnitMeasure {
  const normalized = value.trim().toLowerCase();
  const labels = UNIT_LABELS[normalized] ?? { name: value, abbreviation: value };

  return UnitMeasure.create('', labels.name, labels.abbreviation);
}

/**
 * Assembles a {@link CustomSupply} domain entity from the flat API response.
 *
 * All endpoints (GET list, GET by id, POST, PATCH) return the same flat shape:
 * supplyId, supplyName, categoryName — no nested objects.
 */
export function assembleCustomSupply(dto: CustomSupplyResponse): CustomSupply {
  const supplyDto = dto.supply;
  const isPerishable = supplyDto?.isPerishable ?? dto.isPerishable ?? dto.supplyIsPerishable ?? false;
  const supply = Supply.create(
    supplyDto?.id ?? dto.supplyId ?? '',
    supplyDto?.name ?? dto.name,
    supplyDto?.description ?? dto.description,
    supplyDto?.category ?? dto.categoryName,
    isPerishable,
  );

  const unitMeasure = assembleUnitMeasure(dto.unitMeasurement);
  const minimumStock = dto.minimumStock ?? 0;
  const maximumStock = dto.maximumStock ?? minimumStock;

  return CustomSupply.create(
    dto.id,
    dto.accountId ?? '',
    dto.name,
    dto.supplyId ?? supply.id,
    supply,
    { minimumStock, maximumStock },
    {
      amount: parseFloat(dto.unitPriceAmount) || 0,
      currencyCode: dto.unitPriceCurrencyCode ?? 'PEN',
    },
    dto.description,
    unitMeasure,
    dto.pictureUrl,
  );
}
