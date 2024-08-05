import { chance } from '../chance';
import { paginate } from '.';
import { PaginationOptions, PaginatedResult } from '../types/pagination';

describe('paginate', () => {
  it('should return paginated results with default options', () => {
    const items = Array.from({ length: 5 }, () => chance.integer());
    const total = 5;
    const options: PaginationOptions = {};

    const result: PaginatedResult<number> = paginate(items, total, options);

    expect(result.data).toEqual(items);
    expect(result.total).toBe(total);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.totalPages).toBe(1);
  });

  it('should return paginated results with specific options', () => {
    const items = Array.from({ length: 5 }, () => chance.integer());
    const total = 15;
    const options: PaginationOptions = { page: 2, limit: 5 };

    const result: PaginatedResult<number> = paginate(items, total, options);

    expect(result.data).toEqual(items);
    expect(result.total).toBe(total);
    expect(result.page).toBe(2);
    expect(result.limit).toBe(5);
    expect(result.totalPages).toBe(3);
  });

  it('should handle cases where total items is less than limit', () => {
    const items = Array.from({ length: 3 }, () => chance.integer());
    const total = 3;
    const options: PaginationOptions = { page: 1, limit: 10 };

    const result: PaginatedResult<number> = paginate(items, total, options);

    expect(result.data).toEqual(items);
    expect(result.total).toBe(total);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.totalPages).toBe(1);
  });

  it('should handle cases with multiple pages', () => {
    const items = Array.from({ length: 2 }, () => chance.integer());
    const total = 25;
    const options: PaginationOptions = { page: 2, limit: 10 };

    const result: PaginatedResult<number> = paginate(items, total, options);

    expect(result.data).toEqual(items);
    expect(result.total).toBe(total);
    expect(result.page).toBe(2);
    expect(result.limit).toBe(10);
    expect(result.totalPages).toBe(3);
  });

  it('should handle edge case with no items', () => {
    const items: number[] = [];
    const total = 0;
    const options: PaginationOptions = { page: 1, limit: 10 };

    const result: PaginatedResult<number> = paginate(items, total, options);

    expect(result.data).toEqual(items);
    expect(result.total).toBe(total);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.totalPages).toBe(0);
  });
});
