import {Routes} from '@angular/router';

const devicesList = () => import('./views/devices-list/devices-list').then(m => m.DevicesList);

/**
 * Routes for the devices module.
 * Defines paths for device management views.
 */
export const devicesRoutes: Routes = [
  { path: '', loadComponent: devicesList }
];
