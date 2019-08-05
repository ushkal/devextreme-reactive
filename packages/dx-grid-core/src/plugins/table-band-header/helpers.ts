import {
  TABLE_BAND_TYPE, BAND_GROUP_CELL, BAND_HEADER_CELL, BAND_EMPTY_CELL, BAND_DUPLICATE_RENDER,
} from './constants';
import { TABLE_HEADING_TYPE } from '../table-header-row/constants';
import { TABLE_DATA_TYPE } from '../table/constants';
import { findChainByColumnIndex } from '../table-header-row/helpers';
import {
  IsSpecificRowFn, GetColumnBandMetaFn, GetBandComponentFn, BandHeaderRow,
} from '../../types';

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

    const __firstCols = currentTableColumn.column && ['7', '8'].indexOf(currentTableColumn.column!.name) > -1;
    if (__firstCols) {
      // console.log(currentTableColumn.column, currentColumnMeta, currentRowLevel);
    }

  if (currentColumnMeta.level < currentRowLevel) return { type: BAND_EMPTY_CELL, payload: null };
  const currentColumnIndex = tableColumns
    .findIndex(column => column.key === currentTableColumn.key);
  const previousTableColumn = tableColumns[currentColumnIndex - 1];
  let beforeBorder = false;
  if (currentColumnIndex > 0 && currentTableColumn.type === TABLE_DATA_TYPE
    && isNoDataColumn(previousTableColumn.type)) {
    beforeBorder = true;
  }
  if (currentColumnMeta.level === currentRowLevel) {
    if (__firstCols) console.log('>>> band header', currentTableColumn.column!.name, 'max level', maxLevel, 'current', currentRowLevel)
    // console.log()
    return {
      type: BAND_HEADER_CELL,
      payload: {
        tableRow: tableHeaderRows.find(row => row.type === TABLE_HEADING_TYPE),
        rowSpan: maxLevel - currentRowLevel,
        ...beforeBorder && { beforeBorder },
      },
    };
  }

  const currentColumnChain = findChainByColumnIndex(
    tableHeaderColumnChains[currentRowLevel],
    currentColumnIndex,
  );
  const columnVisibleBoundary = viewport.columns
    .find(bound => bound[0] <= currentColumnIndex && currentColumnIndex <= bound[1]);
  const bandStart = Math.max(columnVisibleBoundary![0], currentColumnChain.start);
  if (bandStart < currentColumnIndex) {
    // if (__firstCols) console.log('>>> null', currentTableColumn.column!.name)
    return { type: null, payload: null };
  }

  // if (__firstCols) console.log('>>> group cell', currentTableColumn.column!.name)
  const bandEnd = Math.min(
    columnVisibleBoundary![1],
    currentColumnChain.start + currentColumnChain.columns.length,
  );
  console.log(viewport.columns, tableHeaderColumnChains, currentColumnChain, columnVisibleBoundary)
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
