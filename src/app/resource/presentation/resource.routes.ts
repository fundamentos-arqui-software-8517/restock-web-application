import { Routes } from '@angular/router';

const appTitle = 'RestockWebApplication';

const batchesStockSection = () => import('./views/batches-stock-section/batches-stock-section').then((m) => m.BatchesStockSection);
const customSuppliesSection = () => import('./views/custom-supplies-section/custom-supplies-section').then((m) => m.CustomSuppliesSectionComponent);
const customSupplyDetailSection = () => import('./views/custom-supply-detail-section/custom-supply-detail-section').then((m) => m.CustomSupplyDetailSectionComponent);

/**
 * Inventory routes owned by the Resource bounded context.
 */
export const resourceInventoryRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'custom-supplies',
  },
  {
    path: 'stock',
    pathMatch: 'full',
    redirectTo: 'batches',
  },
  {
    path: 'batches',
    loadComponent: batchesStockSection,
    title: `${appTitle} · Inventory · Batches`,
  },
  {
    path: 'custom-supplies',
    loadComponent: customSuppliesSection,
    title: `${appTitle} · Inventory · Custom Supplies`,
  },
  {
    path: 'custom-supplies/:id',
    loadComponent: customSupplyDetailSection,
    title: `${appTitle} · Inventory · Custom Supply Detail`,
  },
];
