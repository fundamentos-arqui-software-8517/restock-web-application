import { environment } from '../../../../environments/environment';

const BASE = `${environment.baseUrl}/${environment.platformProviderSuppliesEndpointPath}`;

export const SUPPLY_ENDPOINT = BASE;
export const SUPPLY_BY_ID_URL = (id: string) => `${BASE}/${id}`;
export const SUPPLY_CATEGORIES_URL = `${environment.baseUrl}/${environment.platformProviderSupplyCategoriesEndpointPath}`;
