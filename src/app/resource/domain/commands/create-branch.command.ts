export interface CreateBranchCommand {
  accountId: string;
  name: string;
  address: string;
  city: string;
  country: string;
  regionOrState?: string;
  description?: string;
  image?: File;
}
