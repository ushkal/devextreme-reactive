import { PureComputed } from '@devexpress/dx-core';
import { Sorting, SortingDirection, SortingColumnExtension, SortingKeepOther } from '../../types';

const unique = (arr: any[]) => [...Array.from(new Set(arr))];

export const getColumnSortingDirection: PureComputed<
  [Sorting[], string],
  SortingDirection | null
> = (
  sorting, columnName,
) => {
  const columnSorting = sorting.filter(s => s.columnName === columnName)[0];
  return columnSorting ? columnSorting.direction : null;
};

export const getPersistentSortedColumns: PureComputed<
  [Sorting[], SortingColumnExtension[]?],
  string[]
> = (
  sorting, columnExtensions = [],
) => columnExtensions.reduce((acc, { columnName, sortingEnabled }) => {
  if (sortingEnabled === false) {
    if (sorting.findIndex(sortItem => sortItem.columnName === columnName) > -1) {
      acc.push(columnName);
    }
  }
  return acc;
}, [] as string[]);

export const calculateKeepOther: PureComputed<
  [Sorting[], SortingKeepOther, string[]],
  SortingKeepOther
> = (
  sorting, keepOther, persistentSortedColumns = [],
) => {
  if (!persistentSortedColumns.length) return keepOther as SortingKeepOther;
  if (!keepOther) return persistentSortedColumns as SortingKeepOther;

  return Array.isArray(keepOther)
    ? unique([...keepOther, ...persistentSortedColumns])
    : unique([...sorting.map(item => item.columnName), ...persistentSortedColumns]);
};
