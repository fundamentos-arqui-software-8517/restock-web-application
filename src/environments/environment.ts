export const environment = {
  production: true,

  baseUrl: '/api/v1',
  // baseUrl: 'https://restock-web-service.onrender.com/api/v1',

  // Authentication
  platformProviderSignUpEndpointPath: 'auth/sign-up',
  platformProviderSignInEndpointPath: 'auth/sign-in',
  platformProviderForgotPasswordEndpointPath: 'auth/forgot-password',

  // Profiles & Businesses
  platformProviderRegistrationPersonalProfileEndpointPath: 'profiles',
  platformProviderRegistrationBusinessDetailsEndpointPath: 'businesses',

  // Supplies
  platformProviderSuppliesEndpointPath: 'supplies',
  platformProviderSupplyCategoriesEndpointPath: 'supplies/categories',
  platformProviderCustomSuppliesEndpointPath: 'custom-supplies',

  // Inventory
  platformProviderBatchesEndpointPath: 'batches',
  platformProviderBranchesEndpointPath: 'branches',

  // Devices & IoT
  platformProviderDevicesEndpointPath: 'devices',
  platformProviderDeviceThresholdsEndpointPath: 'device-thresholds',
  platformProviderTelemetriesEndpointPath: 'telemetries',

  // Products (Kits & Combos in the UI → /products on the backend)
  platformProviderKitsEndpointPath: 'products',
  platformProviderKitsRegisterEndpointPath: 'products',
  platformProviderProductsEndpointPath: 'products',

  // Notifications
  platformProviderNotificationsEndpointPath: 'notifications',
  notificationsByRecipientUserIdPath: 'notifications?recipientUserId={recipientUserId}',
  notificationsByIdPath: 'notifications/{notificationId}',
  platformProviderPushSubscriptionsEndpointPath: 'push-subscriptions',

  // Stock Threshold Alerts
  stockThresholdsEvaluatePath: 'alerts/stock-thresholds/evaluate',

  // Analytics
  platformProviderAnalyticsEndpointPath: 'metrics',
  analyticsStockDiscrepanciesPath: '/custom-supplies/{id}/stock-discrepancies',
  analyticsRecentSalesPath: '/accounts/{accountId}/recent-sales',
  analyticsCriticalProductsPath: '/accounts/{accountId}/critical-products',
  analyticsDefaultStockDiscrepanciesSupplyId: '' as string,

  // Sales
  platformProviderSalesEndpointsPath: 'sales',

  // Tracking
  platformProviderConciliationTasksEndpointPath: 'conciliation-tasks',
};
