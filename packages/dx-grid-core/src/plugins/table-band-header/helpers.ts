// tslint:disable: max-line-length
import {
  TABLE_BAND_TYPE, BAND_GROUP_CELL, BAND_HEADER_CELL, BAND_EMPTY_CELL,
  BAND_DUPLICATE_RENDER, BAND_FILL_LEVEL_CELL,
} from './constants';
import { TABLE_HEADING_TYPE } from '../table-header-row/constants';
import { TABLE_DATA_TYPE } from '../table/constants';
import { findChainByColumnIndex } from '../table-header-row/helpers';
import {
  IsSpecificRowFn, GetColumnBandMetaFn, GetBandComponentFn, BandHeaderRow,
} from '../../types';
import { TABLE_STUB_TYPE } from '../../utils/virtual-table';
import { PureComputed } from '@devexpress/dx-core';

export const isBandedTableRow: IsSpecificRowFn = tableRow => (tableRow.type === TABLE_BAND_TYPE);
export const isBandedOrHeaderRow: IsSpecificRowFn = tableRow => isBandedTableRow(tableRow)
  || tableRow.type === TABLE_HEADING_TYPE;
export const isNoDataColumn = (columnType: symbol) => columnType !== TABLE_DATA_TYPE;

export const getColumnMeta: GetColumnBandMetaFn = (
  columnName, bands, tableRowLevel,
  level = 0, title = null, result = null,
) => bands.reduce((acc, column) => {
  if (column.columnName === columnName) {
    return { ...acc, title, level };
  }
  if (column.children !== undefined) {
    return getColumnMeta(
      columnName,
      column.children,
      tableRowLevel,
      level + 1,
      level > tableRowLevel ? title : column.title,
      acc,
    );
  }
  return acc;
}, result || { level, title });

const getBandLevel: PureComputed<[any[], string, number?], number> = (bands, bandTitle, level = 0) => {
  for (const band of bands) {
    if (band.title === bandTitle) {
      return level;
    }
    if (band.children !== undefined) {
      const result = getBandLevel(band.children, bandTitle, level + 1);
      if (result >= 0) return result;
    }
  }
  return -1;
};

export const getBandComponent: GetBandComponentFn = (
  { tableColumn: currentTableColumn, tableRow, rowSpan },
  tableHeaderRows, tableColumns, columnBands, tableHeaderColumnChains, viewport,
) => {
  if (rowSpan) return { type: BAND_DUPLICATE_RENDER, payload: null };

  const maxLevel = tableHeaderRows.filter(column => column.type === TABLE_BAND_TYPE).length + 1;
  const level = (tableRow as BandHeaderRow).level;
  const currentRowLevel = level === undefined
    ? maxLevel - 1 : level;
  const currentColumnMeta = currentTableColumn.type === TABLE_DATA_TYPE
    ? getColumnMeta(currentTableColumn.column!.name, columnBands, currentRowLevel)
    : { level: 0, title: '' };

  const currentColumnIndex = tableColumns
    .findIndex(column => column.key === currentTableColumn.key);
  const columnVisibleBoundary = viewport.columns[0];

  const rowsWithBands = tableHeaderColumnChains.filter(r => r.filter(ch => !!(ch as any).bandTitle).length);

  const inVisibleRange = (index: number) => (columnVisibleBoundary[0] <= index && index <= columnVisibleBoundary[1]);

  const getVisibleBandsByLevel = (lvl: number) => (
    rowsWithBands[lvl]
    ? rowsWithBands[lvl].filter((ch: any) => !!(ch as any).bandTitle
      && (inVisibleRange(ch.start) || inVisibleRange(ch.start + ch.columns.length - 1)
        || (ch.start <= columnVisibleBoundary[0] && columnVisibleBoundary[1] <= ch.start + ch.columns.length - 1)
      )
      && getBandLevel(columnBands, (ch as any).bandTitle) === lvl)
    : []
  );

  const rowsWithVisible = rowsWithBands.reduce((acc, row, index) => {
    const rowBands = getVisibleBandsByLevel(index);
    return rowBands.length ? [...acc, [rowBands]] : acc;
  }, [] as any);

  if (currentColumnMeta.level < currentRowLevel) {
    const currentLevelHidden = rowsWithBands.length > rowsWithVisible.length && getVisibleBandsByLevel(currentRowLevel).length === 0;
    if (currentRowLevel > 0 && currentLevelHidden && currentTableColumn.type === TABLE_STUB_TYPE) {

      return { type: BAND_FILL_LEVEL_CELL, payload: null };
    }
    return { type: BAND_EMPTY_CELL, payload: null };
  }

  const previousTableColumn = tableColumns[currentColumnIndex - 1];
  let beforeBorder = false;
  if (currentColumnIndex > 0 && currentTableColumn.type === TABLE_DATA_TYPE
    && isNoDataColumn(previousTableColumn.type)) {
    beforeBorder = true;
  }
  if (currentColumnMeta.level === currentRowLevel) {
    let cellRowSpan = maxLevel - currentRowLevel;

    if (currentTableColumn.type === TABLE_STUB_TYPE) {
      if (cellRowSpan === 0) cellRowSpan = 1;

      cellRowSpan = rowsWithBands.length > rowsWithVisible.length
        ? rowsWithVisible.length || 1
        : maxLevel;

      return {
        type: BAND_FILL_LEVEL_CELL,
        payload: {
          tableRow: tableHeaderRows.find(row => row.type === TABLE_HEADING_TYPE),
          rowSpan: cellRowSpan,
          band_spacer_cell: 'band_spacer_cell',
        },
      };
    }

    return {
      type: BAND_HEADER_CELL,
      payload: {
        tableRow: tableHeaderRows.find(row => row.type === TABLE_HEADING_TYPE),
        rowSpan: cellRowSpan,
        ...beforeBorder && { beforeBorder },
      },
    };
  }

  const currentColumnChain = findChainByColumnIndex(
    tableHeaderColumnChains[currentRowLevel],
    currentColumnIndex,
  );

  const bandStart = Math.max(columnVisibleBoundary![0], currentColumnChain.start);
  if (bandStart < currentColumnIndex) {
    return { type: null, payload: null };
  }

  const bandEnd = Math.min(
    columnVisibleBoundary![1] + 1,
    currentColumnChain.start + currentColumnChain.columns.length,
  );

  return {
    type: BAND_GROUP_CELL,
    payload: {
      colSpan: bandEnd - bandStart,
      value: currentColumnMeta.title!,
      column: currentColumnMeta,
      ...beforeBorder && { beforeBorder },
    },
  };
};
