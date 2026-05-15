import { BaseEntity } from '../../../shared/domain/model/base-entity';

export interface Business extends BaseEntity {
  userId: string;
  ruc: string;
  pictureUrl: string;
  companyName: string;
  mainLocation: string;
}
