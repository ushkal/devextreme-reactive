import { PureComputed } from '@devexpress/dx-core';
import { Getters } from '@devexpress/dx-react-core';
import { TableColumn, TableRow } from './table.types';

/** @internal */
export type GetColumnWidthFn = PureComputed<[TableColumn, number?], number | null>;
/** @internal */
export type GetRowHeightFn = PureComputed<[TableRow, number?], number>;
/** @internal */
export type GetColSpanFn = PureComputed<[TableRow, TableColumn?], number>;
/** @internal */
export type CollapsedColumn = TableColumn & { width: number };
/** @internal */
export type CollapsedCell = { column: Pick<TableColumn, 'key' | 'type'>, colSpan: number };
/** @internal */
type CollapsedRow = TableRow & { cells: any[], height: number };

/** @internal */
export type VisibleBoundary =  ReadonlyArray<number>;
/** @internal */
export type GetVisibleBoundaryFn = PureComputed<
  [ReadonlyArray<any>, number, number, (item: any) => number | null, number, number?],
  VisibleBoundary
>;

/** @internal */
export type GetVisibleBoundaryWithFixedFn = PureComputed<
  [VisibleBoundary, ReadonlyArray<TableColumn>],
  VisibleBoundary[]
>;

/** @internal */
export type GetSpanBoundaryFn = PureComputed<
  [TableColumn[], VisibleBoundary[], (item: any) => number],
  VisibleBoundary[]
>;

/** @internal */
export type CollapseBoundariesFn = PureComputed<
  [number, VisibleBoundary[], ReadonlyArray<VisibleBoundary>[], number],
  VisibleBoundary[]
>;

/** @internal */
export type GetColumnsSizeFn = PureComputed<
  [TableColumn[], number, number, GetColumnWidthFn],
  number
>;

/** @internal */
export type GetCollapsedColumnsFn = PureComputed<
  [TableColumn[], VisibleBoundary[], VisibleBoundary[], GetColumnWidthFn],
  CollapsedColumn[]
>;

/** @internal */
export type GetCollapsedAndStubRowsFn = PureComputed<
// tslint:disable-next-line: max-line-length
  [TableRow[], VisibleBoundary, VisibleBoundary[], GetRowHeightFn, (r: TableRow) => ReadonlyArray<any>, number],
  CollapsedRow[]
>;

/** @internal */
export type GetCollapsedCellsFn = PureComputed<
  [TableColumn[], VisibleBoundary[], VisibleBoundary[], GetColSpanFn],
  CollapsedCell[]
>;

/** @internal */
export type GetCollapsedGridFn = PureComputed<
  [{
    rows: TableRow[], columns: TableColumn[],
    rowsVisibleBoundary: VisibleBoundary, columnsVisibleBoundary: VisibleBoundary[],
    getColumnWidth: GetColumnWidthFn, getRowHeight: GetRowHeightFn,
    getColSpan: GetColSpanFn,
    totalRowCount: number,
    offset: number,
  }],
  { columns: CollapsedColumn[], rows: CollapsedRow[] }
>;

/** @internal */
export type GetColumnWidthGetterFn = PureComputed<
  [TableColumn[], number, number],
  GetColumnWidthFn
>;

export type GridVisibleBounds = {
  columns: ReadonlyArray<number[]>;
  bodyRows: number[];
};

export type VisibleBoundsFn = PureComputed<
  [any, Getters, number, GetColumnWidthFn, GetRowHeightFn], GridVisibleBounds
>;

type PageTriggersMeta = {
  topTriggerIndex?: number,
  topTriggerPosition?: number,
  bottomTriggerIndex?: number,
  bottomTriggerPosition?: number,
};

export type PageTriggersMetaFn = PureComputed<
  [any, Getters, number], PageTriggersMeta
>;
