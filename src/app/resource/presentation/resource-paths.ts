export const RESOURCE_PATHS = {
  customSupplies: {
    root: '/inventory/custom-supplies',
    detail: (id: string) => `/inventory/custom-supplies/${id}`,
  },
} as const;
