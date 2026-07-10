import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { Profile } from '../domain/model/profile.entity';
import { Business } from '../domain/model/business.entity';
import { ProfilesApiEndpoint } from './profiles/profiles-endpoint';
import { BusinessesApiEndpoint } from './businesses/businesses-endpoint';

@Injectable({ providedIn: 'root' })
export class ProfilesApi extends BaseApi {
  private readonly profilesEndpoint: ProfilesApiEndpoint;
  private readonly businessesEndpoint: BusinessesApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.profilesEndpoint = new ProfilesApiEndpoint(http);
    this.businessesEndpoint = new BusinessesApiEndpoint(http);
  }

  /**
   * Gets the profile associated with the given account.
   *
   * Backend:
   * GET /api/v1/profiles?accountId={accountId}
   */
  getProfileByAccountId(accountId: string): Observable<Profile> {
    return this.profilesEndpoint.getByAccountId(accountId);
  }

  /**
   * Gets one profile by its profile document id.
   *
   * Backend:
   * GET /api/v1/profiles/{profileId}
   */
  getProfile(id: string): Observable<Profile> {
    return this.profilesEndpoint.getById(id);
  }

  createProfile(profile: Profile, imageFile?: File): Observable<Profile> {
    return this.profilesEndpoint.createWithImage(profile, imageFile);
  }

  updateProfile(profile: Profile, id: string, imageFile?: File): Observable<Profile> {
    return this.profilesEndpoint.updateWithImage(profile, id, imageFile);
  }

  /**
   * Gets the business associated with the given account.
   *
   * Backend:
   * GET /api/v1/businesses?accountId={accountId}
   */
  getBusinessByAccountId(accountId: string): Observable<Business> {
    return this.businessesEndpoint.getByAccountId(accountId);
  }

  /**
   * Gets one business by its business document id.
   *
   * Backend:
   * GET /api/v1/businesses/{businessId}
   */
  getBusiness(id: string): Observable<Business> {
    return this.businessesEndpoint.getById(id);
  }

  createBusiness(business: Business, imageFile?: File): Observable<Business> {
    return this.businessesEndpoint.createWithImage(business, imageFile);
  }

  updateBusiness(business: Business, id: string, imageFile?: File): Observable<Business> {
    return this.businessesEndpoint.updateWithImage(business, id, imageFile);
  }
}