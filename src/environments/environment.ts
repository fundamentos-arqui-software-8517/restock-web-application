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
};
