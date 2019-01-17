import { TableColumns, TableColumn, TableRows, TableRow } from './table.types';

export type GetColumnWidthFn = (...args: [TableColumn, number?]) => number;
export type GetRowHeightFn = (...args: [TableRow, number?]) => number;
export type GetColSpanFn = (...args: [TableRow, TableColumn?]) => number;
export type CollapsedColumn = TableColumn & { width: number };
export type CollapsedCell = { column: Pick<TableColumn, 'key' | 'type'>, colSpan: number };
type CollapsedRow = TableRow & { cells: any[], height: number };

export type VisibleBoundary = [number, number];
export type GetVisibleBoundaryFn = (
  ...args: [ReadonlyArray<any>, number, number, (item: any) => number, number]
) => VisibleBoundary;

export type GetVisibleBoundaryWithFixedFn = (
  ...args: [VisibleBoundary, ReadonlyArray<TableColumn>]
) => VisibleBoundary[];

export type GetSpanBoundaryFn = (
  ...args: [TableColumns, VisibleBoundary[], (item: any) => number]
) => VisibleBoundary[];

export type CollapseBoundariesFn = (
  ...args: [number, VisibleBoundary[], VisibleBoundary[][]]
) => VisibleBoundary[];

export type GetColumnsSizeFn = (
  ...args: [TableColumns, number, number, GetColumnWidthFn]
) => number;

export type GetCollapsedColumnsFn = (
  ...args: [TableColumns, VisibleBoundary[], VisibleBoundary[], GetColumnWidthFn]
) => CollapsedColumn[];

export type GetCollapsedAndStubRowsFn = (
  ...args: [TableRows, VisibleBoundary, VisibleBoundary[], GetRowHeightFn, (r: TableRow) => any[]]
) => CollapsedRow[];

export type GetCollapsedCellsFn = (
  ...args: [TableColumns, VisibleBoundary[], VisibleBoundary[], GetColSpanFn]
) => CollapsedCell[];

export type GetCollapsedGridFn = (
  args: {
    rows: TableRows, columns: TableColumns,
    top: number, height: number, left: number, width: number,
    getColumnWidth: GetColumnWidthFn, getRowHeight: GetRowHeightFn, getColSpan: GetColSpanFn,
  }) => { columns: CollapsedColumn[], rows: CollapsedRow[] };
