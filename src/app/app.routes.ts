import { Routes } from '@angular/router';
import { Layout } from './shared/presentation/components/layout/layout';
import { profilesRoutes } from './profiles/presentation/profiles.routes';
import { resourceInventoryRoutes } from './resource/presentation/resource.routes';

const baseTitle = 'RestockWebApplication';

export const appRoutes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./shared/presentation/views/home/home-page').then((m) => m.HomePage),
        title: `${baseTitle} · Overview`,
      },
      {
        path: 'inventory',
        children: resourceInventoryRoutes,
      },
      {
        path: 'profiles',
        children: profilesRoutes,
      },
      {
        path: 'recipes',
        loadComponent: () =>
          import('./shared/presentation/views/placeholder-page/placeholder-page').then((m) => m.PlaceholderPage),
        data: { titleKey: 'nav.recipes' },
        title: `${baseTitle} · Recipes`,
      },
      {
        path: 'sales',
        loadComponent: () =>
          import('./shared/presentation/views/placeholder-page/placeholder-page').then((m) => m.PlaceholderPage),
        data: { titleKey: 'nav.sales' },
        title: `${baseTitle} · Sales`,
      },
      {
        path: 'alerts',
        loadComponent: () =>
          import('./shared/presentation/views/placeholder-page/placeholder-page').then((m) => m.PlaceholderPage),
        data: { titleKey: 'nav.alerts' },
        title: `${baseTitle} · Alerts`,
      },
      {
        path: 'devices',
        loadComponent: () =>
          import('./shared/presentation/views/placeholder-page/placeholder-page').then((m) => m.PlaceholderPage),
        data: { titleKey: 'nav.devices' },
        title: `${baseTitle} · Devices`,
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./profiles/presentation/views/system-preferences/system-preferences').then(
            (m) => m.SystemPreferences,
          ),
        title: `${baseTitle} · Settings`,
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/presentation/views/page-not-found/page-not-found').then((m) => m.PageNotFound),
    title: `${baseTitle} · Not found`,
  },
];
