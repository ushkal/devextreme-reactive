import { Row, GetRowIdFn, RowIds, IsSpecificRowFn } from './grid-core.types';

export type GetTreeChildRowsFn = (currentRow: any | null, rootRows: Row[]) => Row[] | null;

export type TreeMeta = { level: number, leaf: boolean };

// tslint:disable-next-line:prefer-array-literal
export type RowsWithTreeMeta = { rows: Row[], treeMeta: Array<[Row, TreeMeta]>, empty?: boolean };
export type RowsWithTreeMetaMap = { rows: Row[], treeMeta: Map<Row, TreeMeta> };
export type RowsWithCollapsedRowsMetaMap = RowsWithTreeMetaMap
  & { collapsedRowsMeta: Map<Row, Row[]> };

export type ExpandedTreeRowsComputed = (
  rows: RowsWithTreeMetaMap, getRowId: GetRowIdFn, expandedRowIds: RowIds,
) => RowsWithCollapsedRowsMetaMap;

export type GetCustomTreeRowsFn = (
  currentRow: Row,
  getChildRows: GetTreeChildRowsFn,
  rootRows: Row[],
  level?: number,
) => RowsWithTreeMeta;
export type CustomTreeRowsWithMetaComputed = (
  rows: Row[],
  getChildRows: GetTreeChildRowsFn,
) => RowsWithTreeMetaMap;

export type IsSpecificTreeRowGetter = (params: { treeMeta: Map<Row, TreeMeta> }) => IsSpecificRowFn;
