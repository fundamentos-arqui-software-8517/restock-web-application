import { CriticalProduct } from '../../domain/model/critical-product.entity';
import { CriticalProductResponse } from './critical-product.response';

export class CriticalProductAssembler {
  static toEntity(response: CriticalProductResponse): CriticalProduct {
    return response;
  }

  static toEntityList(responses: CriticalProductResponse[]): CriticalProduct[] {
    return responses.map(r => CriticalProductAssembler.toEntity(r));
  }
}

