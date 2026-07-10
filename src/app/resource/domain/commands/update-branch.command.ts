export interface UpdateBranchCommand {
  branchId: string;
  name?: string;
  address?: string;
  city?: string;
  country?: string;
  regionOrState?: string;
  description?: string;
  image?: File;
}
