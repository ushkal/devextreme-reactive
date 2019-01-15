export interface ColumnBands {
  /** A column name that is used to identify a column in the bands tree. */
  columnName?: string;
  /** The band's title. Used only for bands and ignored for columns. */
  title?: string;
  /** Nested bands and columns. */
  children?: ColumnBands[];
}
