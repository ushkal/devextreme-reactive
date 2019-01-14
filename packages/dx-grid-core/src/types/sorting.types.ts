/** Describes the sorting applied to a column */
export interface Sorting {
  /** Specifies a column's name to which the sorting is applied. */
  columnName: string;
  /** Specifies a column's sorting order. */
  direction: 'asc' | 'desc';
}

export type Sortings = ReadonlyArray<Sorting>;
