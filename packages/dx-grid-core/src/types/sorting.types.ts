import { ColumnExtension } from './table.types';

/** Describes the sorting applied to a column */
export interface Sorting {
  /** Specifies a column's name to which the sorting is applied. */
  columnName: string;
  /** Specifies a column's sorting order. */
  direction: 'asc' | 'desc';
}

export type SortingDirection = 'asc' | 'desc';
export type SortingColumnExtension = ColumnExtension & { sortingEnabled?: boolean };
export type ColumnSortingState = { sorting: Sorting[] };
export type ChangeSortingPayload = {
  columnName: string;
  direction: string;
  keepOther: boolean | string[];
  sortIndex: number | undefined;
};
