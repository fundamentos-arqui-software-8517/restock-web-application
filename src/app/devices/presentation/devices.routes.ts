import { Routes } from '@angular/router';

const devicesList = () => import('./views/devices-list/devices-list').then(m => m.DevicesList);
const deviceOnboarding = () => import('./views/device-onboarding/device-onboarding').then(m => m.DeviceOnboarding);

export const devicesRoutes: Routes = [
  { path: '', loadComponent: devicesList },
  { path: 'onboarding', loadComponent: deviceOnboarding },
];
