/**
 * Production defaults. For local dev overrides see `environment.development.ts`
 * (swapped via `fileReplacements` in `angular.json`).
 */
const API_BASE = 'https://restock-web-service.onrender.com/api/v1';

export const environment = {
  production: true,
  resourceApi: {
    batchInventoryBaseUrl: null as string | null,
    batchInventoryHttpPath: '/inventory/batch-inventory',
  },

  salesAPI: {
    salesBaseUrl: API_BASE,
  },

  // Sales Management API
  platformProviderSalesEndpointsPath: 'sales',

  profilesApi: {
    baseUrl: API_BASE,
    fallbackBaseUrl: API_BASE,
  },

  // IAM & Profiles
  platformProviderApiBaseUrl: API_BASE,
  platformProviderSignInEndpointPath: 'auth/sign-in',
  platformProviderSignUpEndpointPath: 'auth/sign-up',
  platformProviderRegistrationBusinessDetailsEndpointPath: 'businesses',
  platformProviderRegistrationPersonalProfileEndpointPath: 'profiles',

  // Resources
  platformProviderCustomSuppliesEndpointPath: 'custom-supplies',
  platformProviderSuppliesEndpointPath: 'supplies',
  platformProviderSupplyCategoriesEndpointPath: 'supplies/categories',

  // IAM
  platformProviderIamApiBaseUrlForSignIn: API_BASE,
  platformProviderForgotPasswordEndpointPath: 'auth/forgot-password',

  // Kits
  platformProviderKitUpdateApiBaseUrl: API_BASE,
  platformProviderKitApiBaseUrl: API_BASE,
  platformProviderKitsRegisterEndpointPath: 'kits/register',
  platformProviderKitsEndpointPath: 'kits',
  platformProviderProductsEndpointPath: 'products',
};

