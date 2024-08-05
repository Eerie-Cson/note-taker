import { PaginationOptions } from '../types/pagination';
import { PaginatedResult } from '../types/pagination';

export function paginate<T>(
  items: T[],
  total: number,
  options: PaginationOptions,
): PaginatedResult<T> {
  const page = options.page || 1;
  const limit = options.limit || 10;

  return {
    data: items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
