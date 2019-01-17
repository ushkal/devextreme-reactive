/** Defines the column configuration object. Used to display data stored in a row. */
import { TableRow, TableColumn } from './table.types';
import { StateReducer } from '@devexpress/dx-core';
export interface Column {
  /*** Specifies the column name or the name of a row field whose value the column displays.
   * If the column name does not match any field name, specify the `getCellValue` function.
   **/
  name: string;
  /** Specifies the column title. */
  title?: string;
  /** Specifies the function used to get the column value for a given row. */
  getCellValue?: GetCellValueFn;
}

export type Row = any;

export type RowId = number | string;
export type RowIds = ReadonlyArray<RowId>;
export type GetRowIdFn = (row: any) => RowId;

type ToggleRowsPayload = { state?: Readonly<boolean> };
export type ToggleRowsFieldReducer = StateReducer<RowIds, ToggleRowsPayload & { rowIds: RowIds }>;
export type ToggleRowFieldReducer = StateReducer<RowIds, ToggleRowsPayload & { rowId: RowId }>;

/** Specifies the function used to get a cell's value. */
export type GetCellValueFn = (row: any, columnName: string) => any;
export type GetRowLevelKeyFn = (row?: any) => string;
export type GetCollapsedRowsFn = (row: any) => Rows;
export type IsSpecificRowFn = (row: any) => boolean;
// tslint:disable-next-line:max-line-length
export type IsSpecificCellFn<P0 = TableRow, P1 = TableColumn, P2 = any> = (p0: P0, p1: P1, p2: P2) => boolean;

export type Rows = ReadonlyArray<any>;
export type Columns = ReadonlyArray<Column>;
