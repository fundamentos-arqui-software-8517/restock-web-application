/**
 * Local / `ng serve` configuration (see `angular.json` → `development` → `fileReplacements`).
 *
 * When your Beeceptor endpoint exists: set `batchInventoryBaseUrl` and keep the path
 * in sync with your mock rule (or change `batchInventoryHttpPath` to match Beeceptor).
 */
export const environment = {
  production: false,
  resourceApi: {
    // Example (uncomment when ready):
    // batchInventoryBaseUrl: 'https://restock-inventory.free.beeceptor.com',
    batchInventoryBaseUrl: null as string | null,
    batchInventoryHttpPath: '/inventory/batch-inventory',
  },

  salesAPI: {
    salesBaseUrl: '/api/v1',
  },

  // Sales Management API
  platformProviderSalesEndpointsPath: 'sales',

  profilesApi: {
    baseUrl: '/api/v1',
    fallbackBaseUrl: '/api/v1',
  },

  // IAM & Profiles
  platformProviderApiBaseUrl: '/api/v1',
  platformProviderSignInEndpointPath: 'auth/sign-in',
  platformProviderSignUpEndpointPath: 'auth/sign-up',
  platformProviderRegistrationBusinessDetailsEndpointPath: 'businesses',
  platformProviderRegistrationPersonalProfileEndpointPath: 'profiles',

  // Resources
  platformProviderCustomSuppliesEndpointPath: 'custom-supplies',
  platformProviderSuppliesEndpointPath: 'supplies',
  platformProviderSupplyCategoriesEndpointPath: 'supplies/categories',

  // IAM
  platformProviderIamApiBaseUrlForSignIn: '/api/v1',
  platformProviderForgotPasswordEndpointPath: 'auth/forgot-password',

  // Kits
  platformProviderKitUpdateApiBaseUrl: '/api/v1',
  platformProviderKitApiBaseUrl: '/api/v1',
  platformProviderKitsRegisterEndpointPath: 'kits/register',
  platformProviderKitsEndpointPath: 'kits',
  platformProviderProductsEndpointPath: 'products',
};

