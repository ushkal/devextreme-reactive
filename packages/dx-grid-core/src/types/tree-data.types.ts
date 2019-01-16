import { Rows, Row, GetRowIdFn, RowIds, IsSpecificRowFn } from './grid-core.types';

export type GetTreeChildRowsFn = (currentRow: any | null, rootRows: Rows) => Rows | null;

export type TreeMeta = { level: number, leaf: boolean };

// tslint:disable-next-line:prefer-array-literal
export type RowsWithTreeMeta = { rows: Rows, treeMeta: Array<[Row, TreeMeta]>, empty?: boolean };
export type RowsWithTreeMetaMap = Readonly<{ rows: Rows, treeMeta: Map<Row, TreeMeta> }>;
export type RowsWithCollapsedRowsMetaMap = Readonly<
  RowsWithTreeMetaMap & { collapsedRowsMeta: Map<Row, Rows> }
>;

export type ExpandedTreeRowsComputed = (
  rows: RowsWithTreeMetaMap, getRowId: GetRowIdFn, expandedRowIds: RowIds,
) => RowsWithCollapsedRowsMetaMap;

export type GetCustomTreeRowsFn = (
  currentRow: Row,
  getChildRows: GetTreeChildRowsFn,
  rootRows: Rows,
  level?: number,
) => RowsWithTreeMeta;
export type CustomTreeRowsWithMetaComputed = (
  rows: Rows,
  getChildRows: GetTreeChildRowsFn,
) => RowsWithTreeMetaMap;

export type IsSpecificTreeRowGetter = (params: { treeMeta: Map<Row, TreeMeta> }) => IsSpecificRowFn;
