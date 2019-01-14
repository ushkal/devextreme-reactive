import { Grouping } from './../../types/grouping.types';
import { Sorting } from '../../types/sorting.types';

export const adjustSortIndex = (
  groupingIndex: number,
  grouping: ReadonlyArray<Grouping>,
  sorting: ReadonlyArray<Sorting>,
) => Math.max(
  grouping.slice(0, groupingIndex).reduce(
    (acc, columnGrouping) => {
      const columnSortingIndex = sorting.findIndex(
        columnSorting => columnSorting.columnName === columnGrouping.columnName,
      );
      return (columnSortingIndex === -1 ? acc - 1 : acc);
    },
    groupingIndex,
  ),
  0,
);
