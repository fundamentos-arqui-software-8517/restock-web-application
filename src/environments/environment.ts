/**
 * Production defaults. For local dev overrides see `environment.development.ts`
 * (swapped via `fileReplacements` in `angular.json`).
 */
export const environment = {
  production: true,
  resourceApi: {
    /**
     * Beeceptor (or any HTTP) origin **without** trailing slash, e.g.
     * `https://tu-proyecto.free.beeceptor.com`
     *
     * When `null` or blank, inventory uses {@link SimulatedBatchInventoryRepository}.
     */
    batchInventoryBaseUrl: null as string | null,
    /**
     * Path appended to `batchInventoryBaseUrl` (GET). Keep in sync with
     * `BATCH_INVENTORY_API_ENDPOINT` in `resource/infrastructure/batch-inventory-api-endpoint.ts`.
     */
    batchInventoryHttpPath: '/inventory/batch-inventory',
  },

  salesAPI: {
    salesBaseUrl: 'https://restock-api-sales.free.beeceptor.com',
  },

  // Sales Management API
  platformProviderSalesEndpointsPath: 'sales',

  /**
   * Profiles bounded context: HTTP API origin (no trailing slash).
   * When null, the app uses the development default inside profiles infrastructure.
   */
  profilesApi: {
    /** Replace with your production profiles API origin when available. */
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

