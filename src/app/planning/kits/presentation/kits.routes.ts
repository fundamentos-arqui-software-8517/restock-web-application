import { Routes } from '@angular/router';

const kitList = () =>
  import('./views/kits-list/kits-list').then((m) => m.PlanningDashboardComponent);

const kitDetail = () => import('./views/kit-detail/kit-detail').then((m) => m.KitDetailComponent);

export const kitsRoutes: Routes = [
  {
    path: '',
    loadComponent: kitList,
    title: 'Kits Catalog',
  },
  {
    path: ':id',
    loadComponent: kitDetail,
    title: 'Kit Detail',
  },
];
