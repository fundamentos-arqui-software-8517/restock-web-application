import { Routes } from '@angular/router';

const salesList = () => import('./view/sales-list/sales-list').then(m => m.SalesList);

/**
 * Routes for the sales module.
 * Defines paths for the sales management bounded context.
 */
export const salesRoutes: Routes = [{ path: '', loadComponent: salesList }];

