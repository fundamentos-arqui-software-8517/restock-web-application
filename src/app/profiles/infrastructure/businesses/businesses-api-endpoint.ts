import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseResponse } from '../../../shared/infrastructure/base-response';
import { BaseApiEndpoint } from '../../../shared/infrastructure/base-api-endpoint';
import { Business } from '../../domain/model/business.entity';
import { BusinessResource } from './businesses.response';
import { BusinessesAssembler } from './businesses.assembler';

const BASE_URL = 'https://restock-fakeapi.free.beeceptor.com';

@Injectable({ providedIn: 'root' })
export class BusinessesApiEndpoint extends BaseApiEndpoint<
  Business,
  BusinessResource,
  BaseResponse,
  BusinessesAssembler
> {
  constructor(http: HttpClient, assembler: BusinessesAssembler) {
    super(http, `${BASE_URL}/businesses`, assembler);
  }
}
