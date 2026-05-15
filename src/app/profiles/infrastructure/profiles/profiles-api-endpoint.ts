import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseResponse } from '../../../shared/infrastructure/base-response';
import { BaseApiEndpoint } from '../../../shared/infrastructure/base-api-endpoint';
import { Profile } from '../../domain/model/profile.entity';
import { ProfileResource } from './profiles.response';
import { ProfilesAssembler } from './profiles.assembler';

const BASE_URL = 'https://restock-fakeapi.free.beeceptor.com';

@Injectable({ providedIn: 'root' })
export class ProfilesApiEndpoint extends BaseApiEndpoint<
  Profile,
  ProfileResource,
  BaseResponse,
  ProfilesAssembler
> {
  constructor(http: HttpClient, assembler: ProfilesAssembler) {
    super(http, `${BASE_URL}/profiles`, assembler);
  }
}
