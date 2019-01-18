import { Row, GetRowIdFn, RowId, IsSpecificRowFn } from './grid-core.types';
import { PureComputed } from '@devexpress/dx-core';

export type GetTreeChildRowsFn = PureComputed<[Row | null, Row[]], Row[] | null>;

export type TreeMeta = { level: number, leaf: boolean };

// tslint:disable-next-line:prefer-array-literal
export type RowsWithTreeMeta = { rows: Row[], treeMeta: Array<[Row, TreeMeta]>, empty?: boolean };
export type RowsWithTreeMetaMap = { rows: Row[], treeMeta: Map<Row, TreeMeta> };
export type RowsWithCollapsedRowsMetaMap = RowsWithTreeMetaMap
  & { collapsedRowsMeta: Map<Row, Row[]> };

export type ExpandedTreeRowsComputed = (
  rows: RowsWithTreeMetaMap, getRowId: GetRowIdFn, expandedRowIds: RowId[],
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

export type IsSpecificTreeRowGetter = PureComputed<[RowsWithTreeMetaMap], IsSpecificRowFn>;
