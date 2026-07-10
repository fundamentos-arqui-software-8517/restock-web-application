import { Routes } from '@angular/router';

const appTitle = 'RestockWebApplication';

const conciliationTasksView = () =>
  import('./views/conciliation-tasks-view/conciliation-tasks-view').then(
    (m) => m.ConciliationTasksView,
  );

const discrepancyDetailView = () =>
  import('./views/discrepancy-detail-view/discrepancy-detail-view').then(
    (m) => m.DiscrepancyDetailView,
  );

const resolutionHistoryView = () =>
  import('./views/resolution-history-view/resolution-history-view').then(
    (m) => m.ResolutionHistoryView,
  );

/**
 * Inventory discrepancy routes owned by the Tracking bounded context.
 */
export const trackingInventoryRoutes: Routes = [
  {
    path: 'discrepancies',
    pathMatch: 'full',
    redirectTo: 'discrepancies/list',
  },
  {
    path: 'discrepancies/list',
    loadComponent: conciliationTasksView,
    title: `${appTitle} · Inventory · Conciliation Tasks`,
  },
  {
    path: 'discrepancies/history',
    loadComponent: resolutionHistoryView,
    title: `${appTitle} · Inventory · Resolution History`,
  },
  {
    path: 'discrepancies/:id',
    loadComponent: discrepancyDetailView,
    title: `${appTitle} · Inventory · Discrepancy Detail`,
  },
];
