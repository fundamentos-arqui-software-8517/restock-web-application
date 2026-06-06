import { SupplyResponse } from './supply.response';
import { Supply } from '../../domain/model/supply.entity';

export function assembleSupply(dto: SupplyResponse): Supply {
  return Supply.create(
    dto.id,
    dto.name,
    dto.description,
    dto.category,
    dto.isPerishable
  );
}
