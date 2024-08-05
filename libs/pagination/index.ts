import * as R from 'ramda';
import { PaginationOptions } from '../types/pagination';
import { PaginatedResult } from '../types/pagination';

export function paginate<T>(
  items: T[],
  total: number,
  options: PaginationOptions,
): PaginatedResult<T> {
  const page = options.page || 1;
  const limit = options.limit || 10;

  const edges = items.map((item) => {
    return R.omit(['_id'])(item as any);
  });

  return {
    data: edges,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
