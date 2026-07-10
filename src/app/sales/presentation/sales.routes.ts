import { Routes } from '@angular/router';

const salesOverview = () =>
  import('./views/sales-overview/sales-overview').then((m) => m.SalesOverviewComponent);

const newSale = () => import('./views/new-sale/new-sale').then((m) => m.NewSaleComponent);

export const salesRoutes: Routes = [
  { path: '', loadComponent: salesOverview, title: 'Sales Overview' },
  { path: 'new', loadComponent: newSale, title: 'New Sale' },
];
