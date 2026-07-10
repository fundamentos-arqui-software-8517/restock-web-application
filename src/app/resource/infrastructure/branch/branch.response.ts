import type { BranchStatus } from '../../domain/model/branch.entity';

/**
 * Raw DTO returned by every branch endpoint.
 */
export interface BranchResponse {
  id: string;
  accountId: string;
  name: string;
  description: string;
  address: string;
  city: string;
  regionOrState: string;
  country: string;
  status: BranchStatus;
  imageUrl: string;
  imagePublicId: string;
}

/**
 * Flexible root the GET /branches endpoint may return.
 * The backend contract is a plain array, but we keep defensive fallbacks.
 */
export type BranchListResponse =
  | BranchResponse[]
  | {
      data?: BranchResponse[];
      branches?: BranchResponse[];
      content?: BranchResponse[];
      items?: BranchResponse[];
    };

/** multipart/form-data body for POST /branches */
export interface CreateBranchRequest {
  name: string;
  address: string;
  city: string;
  country: string;
  regionOrState?: string;
  description?: string;
  image?: File;
}

/** multipart/form-data body for PATCH /branches/{id} */
export interface UpdateBranchRequest {
  name?: string;
  address?: string;
  city?: string;
  country?: string;
  regionOrState?: string;
  description?: string;
  image?: File;
}

/** application/json body for PATCH /branches/{id}/status */
export interface UpdateBranchStatusRequest {
  status: BranchStatus;
}

/** Response for DELETE /branches/{id} */
export interface DeleteBranchResponse {
  id: string;
  deactivatedAt: string;
}
