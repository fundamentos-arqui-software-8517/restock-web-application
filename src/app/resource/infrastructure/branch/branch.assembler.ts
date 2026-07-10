import { Branch, type BranchStatus } from '../../domain/model/branch.entity';
import type { BranchListResponse, BranchResponse } from './branch.response';

/**
 * Converts a single branch API response into a {@link Branch} domain entity.
 */
export function assembleBranch(dto: BranchResponse): Branch {
  return Branch.create(
    dto.id ?? '',
    dto.accountId ?? '',
    dto.name ?? '',
    dto.description ?? '',
    dto.address ?? '',
    dto.city ?? '',
    dto.regionOrState ?? '',
    dto.country ?? '',
    normalizeStatus(dto.status),
    dto.imageUrl ?? '',
    dto.imagePublicId ?? '',
  );
}

/**
 * Converts the root response of GET /branches into an array of {@link Branch} entities.
 *
 * The backend contract is a plain array, but we apply defensive unwrapping to
 * guard against envelope variations.
 */
export function assembleBranchList(response: BranchListResponse): Branch[] {
  return branchItemsFrom(response).map(assembleBranch);
}

function branchItemsFrom(response: BranchListResponse): BranchResponse[] {
  if (Array.isArray(response)) return response;

  return (
    response.data ??
    response.branches ??
    response.content ??
    response.items ??
    []
  );
}

function normalizeStatus(value: string | undefined): BranchStatus {
  return value === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';
}
