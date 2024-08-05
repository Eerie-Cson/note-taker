import { chance } from '../chance';
import { paginate } from '.';
import { PaginationOptions, PaginatedResult } from '../types/pagination';

type Item = {
  _id: string;
  title: string;
  content: string;
};

describe('paginate', () => {
  it('should return paginated results with default options', () => {
    const items: Item[] = Array.from({ length: 5 }, () => ({
      _id: chance.guid(),
      title: chance.sentence({ words: 3 }),
      content: chance.paragraph({ sentence: 1 }),
    }));
    const total = 5;
    const options: PaginationOptions = {};

    const result: PaginatedResult<Item> = paginate(items, total, options);

    expect(result.data).toHaveLength(5);
    expect(result.total).toBe(total);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.totalPages).toBe(1);
    result.data.forEach((item) => {
      expect(item).not.toHaveProperty('_id');
    });
  });

  it('should return paginated results with specific options', () => {
    const items: Item[] = Array.from({ length: 5 }, () => ({
      _id: chance.guid(),
      title: chance.sentence({ words: 3 }),
      content: chance.paragraph({ sentence: 1 }),
    }));
    const total = 15;
    const options: PaginationOptions = { page: 2, limit: 5 };

    const result: PaginatedResult<Item> = paginate(items, total, options);

    expect(result.data).toHaveLength(5);
    expect(result.total).toBe(total);
    expect(result.page).toBe(2);
    expect(result.limit).toBe(5);
    expect(result.totalPages).toBe(3);
    result.data.forEach((item) => {
      expect(item).not.toHaveProperty('_id');
    });
  });

  it('should handle cases where total items is less than limit', () => {
    const items: Item[] = Array.from({ length: 3 }, () => ({
      _id: chance.guid(),
      title: chance.sentence({ words: 3 }),
      content: chance.paragraph({ sentence: 1 }),
    }));
    const total = 3;
    const options: PaginationOptions = { page: 1, limit: 10 };

    const result: PaginatedResult<Item> = paginate(items, total, options);

    expect(result.data).toHaveLength(3);
    expect(result.total).toBe(total);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.totalPages).toBe(1);
    result.data.forEach((item) => {
      expect(item).not.toHaveProperty('_id');
    });
  });

  it('should handle cases with multiple pages', () => {
    const items: Item[] = Array.from({ length: 2 }, () => ({
      _id: chance.guid(),
      title: chance.sentence({ words: 3 }),
      content: chance.paragraph({ sentence: 1 }),
    }));
    const total = 25;
    const options: PaginationOptions = { page: 2, limit: 10 };

    const result: PaginatedResult<Item> = paginate(items, total, options);

    expect(result.data).toHaveLength(2);
    expect(result.total).toBe(total);
    expect(result.page).toBe(2);
    expect(result.limit).toBe(10);
    expect(result.totalPages).toBe(3);
    result.data.forEach((item) => {
      expect(item).not.toHaveProperty('_id');
    });
  });

  it('should handle edge case with no items', () => {
    const items: Item[] = [];
    const total = 0;
    const options: PaginationOptions = { page: 1, limit: 10 };

    const result: PaginatedResult<Item> = paginate(items, total, options);

    expect(result.data).toHaveLength(0);
    expect(result.total).toBe(total);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.totalPages).toBe(0);
  });
});
