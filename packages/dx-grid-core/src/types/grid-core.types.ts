/** Defines the column configuration object. Used to display data stored in a row. */
import { TableRow, TableColumn } from './table.types';
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

export type RowId = number | string;
export type RowIds = ReadonlyArray<RowId>;
export type GetRowIdFn = (row: any) => RowId;

/** Specifies the function used to get a cell's value. */
export type IGetCellValue = (row: any, columnName: string) => any;
export type IGetRowLevelKey = (row: any) => string;
export type IsSpecificRowFn = (row: any) => boolean;
export type IsSpecificCellFn<P0 = TableRow, P1 = TableColumn> = (p0: P0, p1: P1) => boolean;

export type Rows = ReadonlyArray<any>;
export type Columns = ReadonlyArray<Column>;
