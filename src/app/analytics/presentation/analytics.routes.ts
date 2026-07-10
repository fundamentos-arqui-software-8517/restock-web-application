import { Routes } from '@angular/router';

const appTitle = 'RestockWebApplication';

const dashboardSection = () => import('./views/dashboard-section/dashboard-section').then((m) => m.DashboardSectionComponent);

/**
 * Analytics routes owned by the Analytics bounded context.
 */
export const analyticsRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    loadComponent: dashboardSection,
    title: `${appTitle} · Analytics · Dashboard`,
  },
];
