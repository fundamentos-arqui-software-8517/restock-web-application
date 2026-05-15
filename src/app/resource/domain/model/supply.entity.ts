/**
 * Base catalog supply (backend seed data).
 */
export interface Supply {
  id: string;
  name: string;
  description: string;
  perishable: boolean;
  category: string;
}
