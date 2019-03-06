import {
  GetVisibleBoundaryWithFixedFn, VisibleBoundary, GetVisibleBoundaryFn, GetSpanBoundaryFn,
  CollapseBoundariesFn, GetColumnsSizeFn, GetCollapsedColumnsFn, CollapsedColumn,
  GetCollapsedAndStubRowsFn, GetCollapsedCellsFn, GetCollapsedGridFn, GetColumnWidthFn,
  TableColumn, TableRow,
  CollapsedCell,
} from '../types';

export const TABLE_STUB_TYPE = Symbol('stub');
import { PureComputed } from '@devexpress/dx-core';

export const getVisibleBoundaryWithFixed: GetVisibleBoundaryWithFixedFn = (
  visibleBoundary, items,
) => items.reduce((acc, item, index) => {
  if (item.fixed && (index < visibleBoundary[0] || index > visibleBoundary[1])) {
    acc.push([index, index]);
  }
  return acc;
}, [visibleBoundary] as [VisibleBoundary]);

export const getVisibleBoundary: GetVisibleBoundaryFn = (
  items, viewportStart, viewportSize, getItemSize, offset, itemSize = 0,// overscan,
) => {
  let start: number | null = null;
  let end: number | null = null;

  const viewportEnd = viewportStart + viewportSize;
  let index = 0;
  let beforePosition = offset * itemSize;
  if (beforePosition + items.length * itemSize < viewportStart) {
    beforePosition = viewportStart;
    index = items.length;
    start = Math.round(viewportStart / itemSize) - offset;
    end = start + items.length;
  }
  // const topOffset = offset * itemSize;

  while (end === null && index < items.length) {
    const item = items[index];
    const afterPosition = beforePosition + getItemSize(item);
    const isVisible = (beforePosition >= viewportStart && beforePosition < viewportEnd)
      || (afterPosition > viewportStart && afterPosition <= viewportEnd)
      || (beforePosition < viewportStart && afterPosition > viewportEnd);
    if (isVisible && start === null) {
      start = index;
    }
    if (!isVisible && start !== null) {
      end = index - 1;
      break;
    }
    index += 1;
    beforePosition = afterPosition;
  }
  if (start !== null && end === null) {
    end = index - 1;
  }

  start = start === null ? 0 : start;
  end = end === null ? 0 : end;
  // console.log('st, e', start, end)

  // if (overscan) {
  //   start = Math.max(0, start - overscan);
  //   end = Math.min(items.length - 1, end + overscan);
  // }

  return [start + offset, end + offset];
};

export const getRenderBoundary: GetRenderBoundaryFn = (itemsCount, visibleBoundary, overscan) => {
  let [start, end] = visibleBoundary;
  start = Math.max(0, start - overscan);
  end = Math.min(itemsCount - 1, end + overscan);
  // end = end + overscan;

  return [start, end];
};

export const getColumnsVisibleBoundary: PureComputed<
  [TableColumn[], number, number, GetColumnWidthFn], VisibleBoundary[]
> = (columns, left, width, getColumnWidth) => (
  getVisibleBoundaryWithFixed(
    getVisibleBoundary(columns, left, width, getColumnWidth, 0),//, 1),
    columns,
  )
);
export const getRowsVisibleBoundary: PureComputed<
[TableRow[], number, number, GetColumnWidthFn, number, number], VisibleBoundary
> = (rows, top, height, getRowHeight, offset, rowHeight) => {
  return (
    getVisibleBoundary(rows, top, height, getRowHeight, offset, rowHeight)//, 3)
  );
};

type GetRenderBoundaryFn = PureComputed<[number, number[], number], number[]>;

export const getColumnsRenderBoundary: GetRenderBoundaryFn = (columns, visibleBoundary, overscan) => (
  getRenderBoundary(columns, visibleBoundary, 1)
);

export const getRowsRenderBoundary: GetRenderBoundaryFn = (rowsCount, visibleBoundary, overscan) => (
  getRenderBoundary(rowsCount, visibleBoundary, overscan)
);

export const getSpanBoundary: GetSpanBoundaryFn = (
  items, visibleBoundaries, getItemSpan,
) => visibleBoundaries
  .map((visibleBoundary) => {
    let [start, end] = visibleBoundary;
    for (let index = 0; index <= visibleBoundary[1]; index += 1) {
      const span = getItemSpan(items[index]);
      if (index < visibleBoundary[0] && index + span > visibleBoundary[0]) {
        start = index;
      }
      if (index + (span - 1) > visibleBoundary[1]) {
        end = index + (span - 1);
      }
    }
    return [start, end] as VisibleBoundary;
  });

export const collapseBoundaries: CollapseBoundariesFn = (
  itemsCount, visibleBoundaries, spanBoundaries, offset = 0,
) => {

  const testboundaries: VisibleBoundary[] = [];
  // const boundaries: VisibleBoundary[] = [];
  // console.log('collapse boundaries')
  let min = itemsCount;
  let max = 0;
  /* const visiblePoints = */
  visibleBoundaries.reduce((acc: number[], boundary) => {
    for (let point = boundary[0]; point <= boundary[1]; point += 1) {
      acc.push(point);
      if (point < min) {
        min = point;
      }
      if (max < point && point < itemsCount) {
        max = point;
      }
    }
    return acc;
  }, []);

  const spanStartPoints = new Set();
  const spanEndPoints = new Set();
  spanBoundaries.forEach(rowBoundaries => rowBoundaries
    .forEach((boundary) => {
      spanStartPoints.add(boundary[0]);
      spanEndPoints.add(boundary[1]);
    }));
  // console.log(itemsCount, offset)
  // const start = performance.now();

  if (min > 0) {
    testboundaries.push([0, min - 1]);
  }

  for (let i = min; i <= max; i += 1) {
    testboundaries.push([i, i]);
  }

  if (max < itemsCount - 1) {
    testboundaries.push([max + 1, itemsCount - 1]);
  }
  // console.log(testboundaries)

  return testboundaries;

  // console.log('visiblePoints', visiblePoints)


/*
  let lastPoint: number | undefined;
  for (let index = 0; index < itemsCount + offset; index += 1) {
    if (visiblePoints.indexOf(index) !== -1) {
      if (lastPoint !== undefined) {
        boundaries.push([lastPoint, index - 1]);
        lastPoint = undefined;
      }
      boundaries.push([index, index]);
    } else if (spanStartPoints.has(index)) {
      if (index > 0) {
        boundaries.push([
          lastPoint !== undefined ? lastPoint : index,
          index - 1,
        ]);
      }
      lastPoint = index;
    } else if (spanEndPoints.has(index)) {
      boundaries.push([
        lastPoint !== undefined ? lastPoint : index,
        index,
      ]);
      lastPoint = undefined;
    } else if (lastPoint === undefined) {
      lastPoint = index;
    }
  }

  if (lastPoint !== undefined) {
    boundaries.push([lastPoint, itemsCount - 1]);
  }
  console.log(boundaries, testboundaries, itemsCount, max, visibleBoundaries, visiblePoints, spanBoundaries)
  // console.log('collapse', performance.now() - start);

  return testboundaries; */
};

const getColumnsSize: GetColumnsSizeFn = (columns, startIndex, endIndex, getColumnSize) => {
  let size = 0;
  let index;
  const loopEndIndex = endIndex + 1;
  for (index = startIndex; index < loopEndIndex; index += 1) {
    size += getColumnSize(columns[index], 0) || 0;
  }
  return size;
};

export const getCollapsedColumns: GetCollapsedColumnsFn = (
  columns, visibleBoundaries, boundaries, getColumnWidth,
) => {
  const collapsedColumns: CollapsedColumn[] = [];
  boundaries.forEach((boundary) => {
    const isVisible = visibleBoundaries.reduce((acc, visibleBoundary) => (
      acc || (visibleBoundary[0] <= boundary[0] && boundary[1] <= visibleBoundary[1])
    ), false);

    if (isVisible) {
      const column = columns[boundary[0]];
      collapsedColumns.push({
        ...column,
        ...!column.width ? { preferMinWidth: true } : null,
        width: getColumnWidth(column),
      });
    } else {
      collapsedColumns.push({
        key: `${TABLE_STUB_TYPE.toString()}_${boundary[0]}_${boundary[1]}`,
        type: TABLE_STUB_TYPE,
        width: getColumnsSize(columns, boundary[0], boundary[1], getColumnWidth),
      });
    }
  });
  return collapsedColumns;
};

export const getCollapsedRows: GetCollapsedAndStubRowsFn = (
  rows, visibleBoundary, boundaries, getRowHeight, getCells, offset,
) => {
  const collapsedRows: any[] = [];
  boundaries.forEach((boundary) => {
    const isVisible = visibleBoundary[0] <= boundary[0] && boundary[1] <= visibleBoundary[1];
    if (isVisible) {
      const row = rows[boundary[0] - offset];
      collapsedRows.push({
        row,
        cells: getCells(row),
      });
    } else {
      // console.log('COLLAPSE ROWS', boundary[0], boundary[1])
      collapsedRows.push({
        row: {
          key: `${TABLE_STUB_TYPE.toString()}_${boundary[0]}_${boundary[1]}`,
          type: TABLE_STUB_TYPE,
          height: getColumnsSize(rows, boundary[0], boundary[1], getRowHeight),
        },
      });
    }
  });
  return collapsedRows;
};

export const getCollapsedCells: GetCollapsedCellsFn = (
  columns, spanBoundaries, boundaries, getColSpan,
) => {
  const collapsedCells: CollapsedCell[] = [];
  let index = 0;
  while (index < boundaries.length) {
    const boundary = boundaries[index];
    const isSpan = spanBoundaries.reduce((acc, spanBoundary) => (
      acc || (spanBoundary[0] <= boundary[0] && boundary[1] <= spanBoundary[1])), false);
    if (isSpan) {
      const column = columns[boundary[0]];
      const realColSpan = getColSpan(column);
      const realColSpanEnd = (realColSpan + boundary[0]) - 1;
      const colSpanEnd = boundaries.findIndex(
        colSpanBoundary => colSpanBoundary[0]
        <= realColSpanEnd && realColSpanEnd
        <= colSpanBoundary[1],
      );
      collapsedCells.push({
        column,
        colSpan: (colSpanEnd - index) + 1,
      });
      index += 1;
    } else {
      collapsedCells.push({
        column: {
          key: `${TABLE_STUB_TYPE.toString()}_${boundary[0]}_${boundary[1]}`,
          type: TABLE_STUB_TYPE,
        },
        colSpan: 1,
      });
      index += 1;
    }
  }
  return collapsedCells;
};

export const getCollapsedGrid: GetCollapsedGridFn = ({
  rows,
  columns,
  rowsVisibleBoundary,
  columnsVisibleBoundary,
  getColumnWidth = (column: any) => column.width,
  getRowHeight = (row: any) => row.height,
  getColSpan = (row, column) => 1,
  totalRowCount,
  offset,
}) => {
  if (!rows.length || !columns.length) {
    return {
      columns: [],
      rows: [],
    };
  }

  // console.log('get collapsed grid');
  const boundaries = rowsVisibleBoundary || [0, rows.length];
  // const slicedRows = rowsVisibleBoundary
  //   ? rows.slice(rowsVisibleBoundary[0], rowsVisibleBoundary[1])
  //   : rows.slice();
// console.log(columnsVisibleBoundary, rowsVisibleBoundary)

  const rowSpanBoundaries = rows
    .slice(boundaries[0], boundaries[1])
    .map(row => getSpanBoundary(
      columns,
      columnsVisibleBoundary,
      column => getColSpan(row, column),
    ));
  const columnBoundaries = collapseBoundaries(
    columns.length,
    columnsVisibleBoundary,
    rowSpanBoundaries,
    0,
  );

  const rowBoundaries = collapseBoundaries(totalRowCount!, [boundaries], [], offset);
  // console.log('collapse boundaries', totalRowCount, boundaries)

  return {
    columns: getCollapsedColumns(
      columns,
      columnsVisibleBoundary,
      columnBoundaries,
      getColumnWidth,
    ),
    rows: getCollapsedRows(
      rows,
      boundaries,
      rowBoundaries,
      getRowHeight,
      row => getCollapsedCells(
        columns,
        getSpanBoundary(
          columns,
          columnsVisibleBoundary,
          column => getColSpan(row, column),
        ),
        columnBoundaries,
        column => getColSpan(row, column),
      ),
      offset,
    ),
  };
};