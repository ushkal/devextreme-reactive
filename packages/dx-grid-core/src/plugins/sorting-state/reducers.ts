import { Sorting } from '../../types';

interface ChangeSortingParams {
  columnName: string;
  direction: string;
  keepOther: boolean | string[];
  sortIndex: number | undefined;
}

export const changeColumnSorting = (state: { sorting: Sorting[] }, {
  columnName, direction, keepOther, sortIndex,
}: ChangeSortingParams) => {
  const { sorting } = state;

  let nextSorting: any[] = [];
  if (keepOther === true) {
    nextSorting = sorting.slice();
  }
  if (Array.isArray(keepOther)) {
    nextSorting = sorting.slice()
      .filter(s =>
        keepOther.indexOf(s.columnName) > -1);
  }

  const columnSortingIndex = sorting.findIndex(s => s.columnName === columnName);
  const columnSorting = sorting[columnSortingIndex];
  const newColumnSorting = {
    columnName,
    direction: direction
      || (!columnSorting || columnSorting.direction === 'desc' ? 'asc' : 'desc'),
  };

  if (columnSortingIndex > -1) {
    nextSorting.splice(columnSortingIndex, 1);
  }

  if (direction !== null) {
    const newIndexFallback = columnSortingIndex > -1 ? columnSortingIndex : nextSorting.length;
    const newIndex = sortIndex !== undefined ? sortIndex : newIndexFallback;
    nextSorting.splice(newIndex, 0, newColumnSorting);
  }

  return {
    sorting: nextSorting,
  };
};
