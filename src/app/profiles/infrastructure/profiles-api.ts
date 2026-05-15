import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { Profile } from '../domain/model/profile.entity';
import { Business } from '../domain/model/business.entity';
import { ProfilesApiEndpoint } from './profiles/profiles-api-endpoint';
import { BusinessesApiEndpoint } from './businesses/businesses-api-endpoint';

@Injectable({ providedIn: 'root' })
export class ProfilesApi extends BaseApi {
  constructor(
    private readonly profilesEndpoint: ProfilesApiEndpoint,
    private readonly businessesEndpoint: BusinessesApiEndpoint,
  ) {
    super();
  }

  getProfiles(): Observable<Profile[]> {
    return this.profilesEndpoint.getAll();
  }

  getProfile(id: number): Observable<Profile> {
    return this.profilesEndpoint.getById(id);
  }

  updateProfile(profile: Profile, id: number): Observable<Profile> {
    return this.profilesEndpoint.update(profile, id);
  }

  getBusinesses(): Observable<Business[]> {
    return this.businessesEndpoint.getAll();
  }

  getBusiness(id: number): Observable<Business> {
    return this.businessesEndpoint.getById(id);
  }
}
