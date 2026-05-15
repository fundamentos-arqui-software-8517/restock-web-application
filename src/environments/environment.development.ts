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
};
