import type { Routes } from '@angular/router';

const appTitle = 'RestockWebApplication';

/**
 * Inventory routes owned by the Resource bounded context.
 */
export const resourceInventoryRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'stock' },
  {
    path: 'stock',
    loadComponent: () =>
      import('./views/batches-stock-section/batches-stock-section').then((m) => m.BatchesStockSection),
    title: `${appTitle} · Inventory · Stock`,
  },
  {
    path: 'discrepancies',
    loadComponent: () =>
      import('./views/inventory-discrepancies-placeholder/inventory-discrepancies-placeholder').then(
        (m) => m.InventoryDiscrepanciesPlaceholder,
      ),
    title: `${appTitle} · Inventory · Discrepancies`,
  },
];
