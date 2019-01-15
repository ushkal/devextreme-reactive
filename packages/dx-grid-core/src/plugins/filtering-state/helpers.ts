import { Filters } from '../../types';

export const getColumnFilterConfig = (filters: Filters, columnName: string) => {
  if (!filters.length) { return null; }

  const filter = filters.filter(s => s.columnName === columnName)[0];
  if (!filter) return null;

  return filter;
};
