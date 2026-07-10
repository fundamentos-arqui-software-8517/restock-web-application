export const TRACKING_PATHS = {
  discrepancies: {
    root: '/inventory/discrepancies',
    detail: (id: string) => `/inventory/discrepancies/${id}`,
    history: '/inventory/discrepancies/history',
  },
} as const;
