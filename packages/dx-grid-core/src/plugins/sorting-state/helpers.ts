import { PureComputed } from '@devexpress/dx-core';
import { Sorting, SortingDirection, SortingColumnExtension } from '../../types';

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

type KeepOther = boolean | string[];
export const calculateKeepOther: PureComputed<
  [Sorting[], KeepOther, string[]],
  KeepOther
> = (
  sorting, keepOther, persistentSortedColumns = [],
) => {
  if (!persistentSortedColumns.length) return keepOther as KeepOther;
  if (!keepOther) return persistentSortedColumns as KeepOther;

  return Array.isArray(keepOther)
    ? unique([...keepOther, ...persistentSortedColumns])
    : unique([...sorting.map(item => item.columnName), ...persistentSortedColumns]);
};
