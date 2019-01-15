export interface EditingColumnExtension {
  /** The name of a column to extend. */
  columnName: string;
  /** Specifies whether editing is enabled for a column. */
  editingEnabled?: boolean;
  /*** A function that returns a value specifying row changes depending on the columns'
   * editor values for the current row. This function is called each time the
   * editor's value changes. */
  createRowChange?: (row: any, value: any, columnName: string) => any;
}
