import { Routes } from '@angular/router';

const appTitle = 'RestockWebApplication';

const alertsSection = () =>
  import('./views/alerts-section/alerts-section').then(
    m => m.AlertsSectionComponent,
  );

/**
 * Routes owned by the Communications bounded context.
 * Mounted at /alerts in app.routes.ts.
 */
export const communicationsRoutes: Routes = [
  {
    path: '',
    loadComponent: alertsSection,
    title: `${appTitle} · Alerts & Notifications`,
  },
];
