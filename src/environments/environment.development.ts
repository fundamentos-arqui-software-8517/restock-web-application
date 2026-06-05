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
    salesBaseUrl: 'https://restock-api-sales.free.beeceptor.com',
  },

  // Sales Management API
  platformProviderSalesEndpointsPath: 'sales',

  profilesApi: {
    baseUrl: 'https://restock-api-profiles.free.beeceptor.com',
    fallbackBaseUrl: 'https://profiles-restock-api.free.beeceptor.com',
  },

  // IAM & Profiles
  platformProviderApiBaseUrl: 'http://localhost:8080/api/v1',
  platformProviderSignInEndpointPath: 'auth/sign-in',
  platformProviderSignUpEndpointPath: 'auth/sign-up',
  platformProviderRegistrationBusinessDetailsEndpointPath: 'businesses',
  platformProviderRegistrationPersonalProfileEndpointPath: 'profiles',

  // Resources
  platformProviderCustomSuppliesEndpointPath: 'custom-supplies',
  platformProviderSuppliesEndpointPath: 'supplies',
  platformProviderSupplyCategoriesEndpointPath: 'supplies/categories',

  // IAM
  //https://restock-api-iam-login.free.beeceptor.com
  platformProviderIamApiBaseUrlForSignIn: 'https://restock-api-iam-login.free.beeceptor.com',
  platformProviderForgotPasswordEndpointPath: 'auth/forgot-password',

  // Kits
  platformProviderKitUpdateApiBaseUrl: 'https://u202314101.free.beeceptor.com/kits/K-992',
  platformProviderKitApiBaseUrl: 'https://restock-api-planning-kits.free.beeceptor.com',
  platformProviderKitsRegisterEndpointPath: 'kits/register',
  platformProviderKitsEndpointPath: 'kits',
  platformProviderProductsEndpointPath: 'products',
};

