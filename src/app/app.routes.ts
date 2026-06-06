import { Routes } from '@angular/router';
import { requireAuthGuard } from './iam/infrastructure/require-auth.guard';
import { Layout } from './shared/presentation/components/layout/layout';
import { resourceInventoryRoutes } from './resource/presentation/resource.routes';

const baseTitle = 'RestockWebApplication';

const devicesRoutes = () =>import('./devices/presentation/devices.routes').then((m) => m.devicesRoutes);
const iamRoute = () =>import('./iam/presentation/iam.routes').then((m) => m.iamRoutes);
const salesRoute = () =>import('./sales/presentation/sales.routes').then((m) => m.salesRoutes);
const profilesRoute = () =>import('./profiles/presentation/profiles.routes').then((m) => m.profilesRoutes);
const recipesRoute = () =>import('./planning/recipes/presentation/recipes.routes').then((m) => m.recipesRoutes);
const kitsRoute = () =>import('./planning/kits/presentation/kits.routes').then((m) => m.kitsRoutes);
const homePage = () =>import('./shared/presentation/views/home/home-page').then((m) => m.HomePage);
const pageNotFound = () =>import('./shared/presentation/views/page-not-found/page-not-found').then((m) => m.PageNotFound,);
const placeholder = () =>import('./shared/presentation/views/placeholder-page/placeholder-page').then((m) => m.PlaceholderPage,);

/**
 * Application routes configuration.
 * Defines the routing structure for the Angular application, including lazy-loaded components and child routes.
 */
export const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'sign-in' },
  { path: 'login', pathMatch: 'full', redirectTo: 'sign-in' },
  { path: '', loadChildren: iamRoute },
  { path: 'profiles', loadChildren: profilesRoute },

  {
    path: '',
    component: Layout,
    canActivate: [requireAuthGuard],
    children: [
      { path: '', loadComponent: homePage, title: `${baseTitle} · Overview` },
      { path: 'home', loadComponent: homePage, title: `${baseTitle} · Overview` },

      { path: 'inventory', children: resourceInventoryRoutes },
      { path: 'recipes', loadChildren: recipesRoute, title: `${baseTitle} · Recipes` },
      { path: 'kits', loadChildren: kitsRoute, title: `${baseTitle} · Kits` },
      { path: 'sales', loadChildren: salesRoute, title: `${baseTitle} · Sales` },

      {
        path: 'settings',
        loadChildren: profilesRoute,
        data: { titleKey: 'nav.settings' },
        title: `${baseTitle} · Settings`,
      },
      {
        path: 'alerts',
        loadComponent: placeholder,
        data: { titleKey: 'nav.alerts' },
        title: `${baseTitle} · Alerts`,
      },
      {
        path: 'devices',
        data: { titleKey: 'nav.devices' },
        loadChildren: devicesRoutes,
        title: `${baseTitle} · Devices`,
      },
    ],
  },

  { path: '**', loadComponent: pageNotFound, title: `${baseTitle} · Not found` },
];