export interface NavSubItem {
  labelKey: string;
  link: string;
}

export interface NavItem {
  labelKey: string;
  icon: string;
  link: string;
  children?: NavSubItem[];
  allowedRoles?: string[];
}
