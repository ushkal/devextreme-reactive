/** Defines the column configuration object. Used to display data stored in a row. */
export interface Column {
  /*** Specifies the column name or the name of a row field whose value the column displays.
   * If the column name does not match any field name, specify the `getCellValue` function.
   **/
  name: string;
  /** Specifies the column title. */
  title?: string;
  /** Specifies the function used to get the column value for a given row. */
  getCellValue?: IGetCellValue;
}

export type Row = any;

export type IGetRowId = (row: any) => number | string;

/** Specifies the function used to get a cell's value. */
export type IGetCellValue = (row: any, columnName: string) => any;
export type IGetRowLevelKey = (row: any) => string;
export type IsGroupRow = (row: any) => boolean;

export type Rows = ReadonlyArray<any>;
export type Columns = ReadonlyArray<Column>;
