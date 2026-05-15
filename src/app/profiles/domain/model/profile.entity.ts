import { BaseEntity } from '../../../shared/domain/model/base-entity';

export interface Profile extends BaseEntity {
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatarUrl: string;
  gender: string;
  birthDate: string;
}
