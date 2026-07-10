/**
 * Static dictionary of URLs owned by the Sales bounded context.
 * Avoids hardcoding route strings across components.
 */
export const SALES_PATHS = {
  overview: {
    root: '/sales',
  },
  newSale: {
    root: '/sales/new',
  },
} as const;
