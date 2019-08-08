import {
  TABLE_BAND_TYPE, BAND_GROUP_CELL, BAND_HEADER_CELL, BAND_EMPTY_CELL, BAND_DUPLICATE_RENDER,
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
  debugger
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

    // const __firstCols = currentTableColumn.column && ['7', '8'].indexOf(currentTableColumn.column!.name) > -1;
    // if (__firstCols) {
      // console.log(currentTableColumn.column, currentColumnMeta, currentRowLevel);
    // }

  const currentColumnIndex = tableColumns
    .findIndex(column => column.key === currentTableColumn.key);
  const columnVisibleBoundary = viewport.columns[0];
  // viewport.columns
  //   .find(bound => bound[0] <= currentColumnIndex && currentColumnIndex <= bound[1])!;

  // const getLevelBandChains = (rowLevel: number) => columnVisibleBoundary
  //   ? tableHeaderColumnChains[rowLevel]
  //     .filter(ch => columnVisibleBoundary[0] <= ch.start
  //     && ch.start + ch.columns.length <= columnVisibleBoundary[1])
  //   : []
  // .filter(ch => (ch as any).bandTitle !== null);

  // const currentLevelBandChains = getLevelBandChains(currentRowLevel);
  // console.log(currentLevelBandChains)

  if (currentColumnMeta.level < currentRowLevel) {
    // const upperLevelBandChain = currentRowLevel > 0 && getLevelBandChains(currentRowLevel - 1);
    // const levelBandVisible = upperLevelBandChain && upperLevelBandChain.length > 0;

    if (currentRowLevel > 0 && columnVisibleBoundary && currentColumnIndex === columnVisibleBoundary![0]) {
    // if (currentRowLevel > 0 && !levelBandVisible && columnVisibleBoundary && currentColumnIndex === columnVisibleBoundary![0]) {
      // console.log(viewport.columns, columnBands, tableHeaderColumnChains)
      // console.log('FILL LEVEL! ', currentRowLevel, 'band visible', upperLevelBandChain, maxLevel)
      return { type: 'fill_level_cell', payload: { fill_level_cell: 'fill_level_cell' } };
    }
    return { type: BAND_EMPTY_CELL, payload: null };
  }

  const previousTableColumn = tableColumns[currentColumnIndex - 1];
  let beforeBorder = false;
  if (currentColumnIndex > 0 && currentTableColumn.type === TABLE_DATA_TYPE
    && isNoDataColumn(previousTableColumn.type)) {
    beforeBorder = true;
  }
  if (currentTableColumn.type === TABLE_STUB_TYPE) {
    console.log('STUB CELL', currentColumnMeta, currentRowLevel, columnVisibleBoundary)
    // console.log('chains', tableHeaderColumnChains)
  }
  if (currentColumnMeta.level === currentRowLevel) {
    // if (__firstCols) console.log('>>> band header', currentTableColumn.column!.name, 'max level', maxLevel, 'current', currentRowLevel)
    // console.log()
    const rowsWithBands = tableHeaderColumnChains.filter(r => r.filter(ch => !!(ch as any).bandTitle).length);

    const inVisibleRange = (index: number) => (columnVisibleBoundary[0] <= index && index <= columnVisibleBoundary[1]);

    const rowsWithVisible = rowsWithBands.reduce((acc, row, index) => {
      // console.log(row, index)
      const rowBands = row.filter(ch => !!(ch as any).bandTitle
        && (inVisibleRange(ch.start) || inVisibleRange(ch.start + ch.columns.length - 1))
        && getBandLevel(columnBands, (ch as any).bandTitle) === index)
      // ).map(ch => ({ ...ch, level: getBandLevel(columnBands, (ch as any).bandTitle)}))
      return rowBands.length ? [...acc, [rowBands]] : acc;
    }, [] as any);

    console.log('vis bands', rowsWithVisible, 'all bands', rowsWithBands, columnVisibleBoundary)


    // const rowsWithVisibleBands = rowsWithBands.filter(r =>
    //   r.filter(ch => !!(ch as any).bandTitle
    //     && (inVisibleRange(ch.start) || inVisibleRange(ch.start + ch.columns.length))
    //   ).length);
    // console.log('rowsWithBands', rowsWithBands, 'visible', rowsWithVisibleBands, columnVisibleBoundary)

    // const spanCorrection = currentTableColumn.type === TABLE_STUB_TYPE ? rowsWithBands.length - rowsWithVisible.length + 1 : 0;
    // console.log('span correction', spanCorrection)
    // const spanCorrection = currentLevelBandChains.length === 0 && currentTableColumn.type === TABLE_STUB_TYPE ? 1 : 0;
    // const spanCorrection = !!columnVisibleBoundary && currentLevelBandChains.length === 0
    // && currentColumnIndex === columnVisibleBoundary![0] ? 1 : 0;
    // if (spanCorrection)
    // console.log(spanCorrection)
    // console.log(maxLevel - currentRowLevel - spanCorrection, spanCorrection)
    let cellRowSpan = currentTableColumn.type === TABLE_STUB_TYPE ? 1 : maxLevel - currentRowLevel;
    // let cellRowSpan = maxLevel - currentRowLevel - spanCorrection;
    if (cellRowSpan === 0) cellRowSpan = 1;

    if (currentTableColumn.type === TABLE_STUB_TYPE) {
      console.log('row level', currentRowLevel, maxLevel)
    // if (spanCorrection > 0) {
      // console.log('correct span', currentTableColumn, currentLevelBandChains, 'chains', tableHeaderColumnChains, 'boundary', columnVisibleBoundary, spanCorrection, 'level', currentRowLevel)
      return {
        type: 'band_spacer_cell',
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
    // if (__firstCols) console.log('>>> null', currentTableColumn.column!.name)
    return { type: null, payload: null };
  }

  // if (__firstCols) console.log('>>> group cell', currentTableColumn.column!.name)
  const bandEnd = Math.min(
    columnVisibleBoundary![1] + 1,
    currentColumnChain.start + currentColumnChain.columns.length,
  );
  console.log('colspan', columnVisibleBoundary,
    currentColumnChain)
  // console.log(viewport.columns, tableHeaderColumnChains, currentColumnChain, columnVisibleBoundary)
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
