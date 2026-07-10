import type { BranchStatus } from '../model/branch.entity';

export interface UpdateBranchStatusCommand {
  branchId: string;
  status: BranchStatus;
}
