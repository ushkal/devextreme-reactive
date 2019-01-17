import { Column } from './grid-core.types';
import { Style } from 'jss/css';

/** Describes properties of a table row that the Table plugin renders. */
export interface TableRow {
  /** A unique table row identifier. */
  key: string;
  /*** Specifies the table row type. The specified value defines which cell template
   * is used to render the row. */
  type: symbol;
  /** Specifies the associated row's ID. */
  rowId?: number | string;
  /** Specifies the associated row. */
  row?: any;
  /** Specifies the table row height. */
  height?: number;
}

/** Describes properties of a table column that the Table plugin renders. */
export interface TableColumn {
  /** A unique table column identifier. */
  key: string;
  /*** Specifies the table column type. The specified value defines which cell template
   * is used to render the column. */
  type: symbol;
  /** Specifies the associated user column. */
  column?: Column;
  /** Specifies the table column width. */
  width?: number;
  /** Specifies the table's column alignment. */
  align?: 'left' | 'right' | 'center';
  /** Specifies the fixed table's column alignment. */
  fixed?: 'left' | 'right';
}

export interface ColumnExtension {
  /** The name of the column to extend. */
  columnName: string;
  /** The table column width in pixels. */
  width?: number;
  /** The table column alignment. */
  align?: 'left' | 'right' | 'center';
  /** Specifies whether word wrap is enabled in a column's cells. */
  wordWrapEnabled?: boolean;
}

export type TableColumns = ReadonlyArray<TableColumn>;
export type TableRows = ReadonlyArray<TableRow>;

export type GetCellColSpanFn = (
  params: { tableRow: TableRow, tableColumns: TableColumns, tableColumn: TableColumn },
) => number;
export type CellColSpanGetter = (
  getTableCellColSpan: GetCellColSpanFn,
) => GetCellColSpanFn;

export type ColumnGeometry = { left: number, right: number };
export type TargetColumnGeometry = ColumnGeometry & { top: number, bottom: number };
export type GetTableColumnGeometriesFn = (...args: [TableColumns, number]) => ColumnGeometry[];
export type GetTableTargetColumnIndexFn = (...args: [
  TargetColumnGeometry[], number, number
]) => number;
export type GetTargetColumnGeometriesFn = (
  ...args: [TargetColumnGeometry[], number]
) => TargetColumnGeometry[];

export type ColumnAnimation = {
  startTime: number,
  style: Style,
  left?: { from: number, to: number },
};
export type ColumnAnimationMap = Map<string, ColumnAnimation>;
export type GetColumnAnimationsFn = (
  ...args: [TableColumns, TableColumns, number, ColumnAnimationMap]
) => ColumnAnimationMap;
