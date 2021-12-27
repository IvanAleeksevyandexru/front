import { Filters, FindOptionsGroup } from './typings';

export function countFilters(
  filters: Filters,
  exceptions: (keyof Filters | keyof FindOptionsGroup)[],
): number {
  let count = 0;
  if (!filters) {
    return count;
  }
  const finded = Object.entries(filters).filter(
    ([key, value]) => (!!value || value === 0) && !exceptions.includes(key as keyof Filters),
  );
  count += finded.length;

  if (filters?.inlearnoPayments) {
    count += Object.entries(filters.inlearnoPayments).filter(([, value]) => value).length;
  }
  if (filters?.pfdoPayments) {
    count += Object.entries(filters.pfdoPayments).filter(([, value]) => value).length;
  }

  return count;
}
