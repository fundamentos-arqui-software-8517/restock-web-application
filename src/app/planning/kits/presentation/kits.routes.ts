import { Routes } from '@angular/router';

const kitList = () =>
  import('./views/kits-list/kits-list').then(
    (m) => m.PlanningDashboardComponent
  );

const createKit = () =>
  import('./views/create-kit/create-kit').then(
    (m) => m.KitFormModalComponent
  );

/**
 * Route tree for planning presentation views.
 */
export const kitsRoutes: Routes = [
  {
    path: '',
    loadComponent: kitList,
    title: 'Kits Catalog',
  },
  {
    path: 'id',
    loadComponent: createKit,
    title: 'Create Kit',
  },
];
