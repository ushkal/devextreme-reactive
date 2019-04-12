import * as React from 'react';
import { Sizer } from '@devexpress/dx-react-core';
import { MemoizedFunction, memoize } from '@devexpress/dx-core';
import {
  getCollapsedGrid, intervalUtil, getColumnsRenderBoundary,
  getColumnsVisibleBoundary, TableColumn, GetColumnWidthFn, getColumnWidthGetter,
} from '@devexpress/dx-grid-core';
import { VirtualTableLayoutProps, VirtualTableLayoutState } from '../../types';

const AUTO_HEIGHT = 'auto';

/** @internal */
/* tslint:disable max-line-length */
export class VirtualTableLayout extends React.PureComponent<VirtualTableLayoutProps, VirtualTableLayoutState> {
  getColumnWidthGetter: MemoizedFunction<[TableColumn[], number, number], GetColumnWidthFn>;
  rowRefs = new Map();
  blockRefs = new Map();
  isEdgeBrowser = false;

  constructor(props) {
    super(props);

    this.state = {
      rowHeights: new Map(),
      viewportTop: 0,
      viewportLeft: 0,
      containerWidth: 800,
      containerHeight: 600,
      height: 0,
      headerHeight: 0,
      bodyHeight: 0,
      footerHeight: 0,
    };

    this.getColumnWidthGetter = memoize(
      (tableColumns, tableWidth, minColumnWidth) => (
        getColumnWidthGetter(tableColumns, tableWidth, minColumnWidth)
      ),
    );

  }

  componentDidMount() {
    this.isEdgeBrowser = isEdgeBrowser();

    this.storeRowHeights();
    this.storeBlockHeights();
  }

  componentDidUpdate() {
    this.storeRowHeights();
    this.storeBlockHeights();
  }

  getRowHeight = (row) => {
    const { rowHeights } = this.state;
    const { estimatedRowHeight } = this.props;
    if (row) {
      const storedHeight = rowHeights.get(row.key);
      if (storedHeight !== undefined) return storedHeight;
      if (row.height) return row.height;
    }
    return estimatedRowHeight;
  }

  registerRowRef = (row, ref) => {
    if (ref === null) {
      this.rowRefs.delete(row);
    } else {
      this.rowRefs.set(row, ref);
    }
  }

  registerBlockRef = (name, ref) => {
    if (ref === null) {
      this.blockRefs.delete(name);
    } else {
      this.blockRefs.set(name, ref);
    }
  }

  storeRowHeights() {
    const rowsWithChangedHeights = Array.from(this.rowRefs.entries())
      // eslint-disable-next-line react/no-find-dom-node
      .map(([row, ref]) => [row, findDOMNode(ref)])
      .filter(([, node]) => !!node)
      .map(([row, node]) => [row, node.getBoundingClientRect().height])
      .filter(([row]) => row.type !== TABLE_STUB_TYPE)
      .filter(([row, height]) => height !== this.getRowHeight(row));

    if (rowsWithChangedHeights.length) {
      const { rowHeights } = this.state;
      rowsWithChangedHeights
        .forEach(([row, height]) => rowHeights.set(row.key, height));

      this.setState({
        rowHeights,
      });
    }
  }

  storeBlockHeights() {
    const getBlockHeight = blockName => (this.blockRefs.get(blockName)
      ? (findDOMNode(this.blockRefs.get(blockName)) as HTMLElement).getBoundingClientRect().height
      : 0
    );
    const headerHeight = getBlockHeight('header');
    const bodyHeight = getBlockHeight('body');
    const footerHeight = getBlockHeight('footer');

    const {
      headerHeight: prevHeaderHeight,
      bodyHeight: prevBodyHeight,
      footerHeight: prevFooterHeight,
    } = this.state;

    if (prevHeaderHeight !== headerHeight
      || prevBodyHeight !== bodyHeight
      || prevFooterHeight !== footerHeight) {
      this.setState({
        headerHeight,
        bodyHeight,
        footerHeight,
      });
    }
  }

  updateViewport = (e, visibleRowBoundaries, viewportTop, ensureNextVirtualPage) => {
    const node = e.target;

    if (this.shouldSkipScrollEvent(e)) {
      return;
    }

    const { estimatedRowHeight } = this.props;
    ensureNextVirtualPage({
      estimatedRowHeight,
      visibleRowBoundaries,
      viewportTop: node.scrollTop,
      containerHeight: this.state.containerHeight,
    });

    this.setState({
      viewportTop: node.scrollTop,
      viewportLeft: node.scrollLeft,
    });
  }

  shouldSkipScrollEvent(e) {
    const node = e.target;

    // NOTE: prevent nested scroll to update viewport
    if (node !== e.currentTarget) {
      return true;
    }
    // NOTE: prevent iOS to flicker in bounces and correct rendering on high dpi screens
    const correction = this.isEdgeBrowser ? 1 : 0;
    const nodeHorizontalOffset = parseInt(node.scrollLeft + node.clientWidth, 10) - correction;
    const nodeVerticalOffset = parseInt(node.scrollTop + node.clientHeight, 10) - correction;
    if (node.scrollTop < 0
      || node.scrollLeft < 0
      || nodeHorizontalOffset > Math.max(node.scrollWidth, node.clientWidth)
      || nodeVerticalOffset > Math.max(node.scrollHeight, node.clientHeight)) {
      return true;
    }

    return false;
  }

  getCollapsedGrids() {
    const getColumnWidth = this.getColumnWidthGetter(columns, containerWidth, minColumnWidth!);
    const getColSpan = (
      tableRow, tableColumn,
    ) => getCellColSpan!({ tableRow, tableColumn, tableColumns: columns });

    const visibleColumnBoundaries = [
      getColumnsRenderBoundary(
        columns.length,
        getColumnsVisibleBoundary(
          columns, viewportLeft, containerWidth, getColumnWidth,
        )[0],
      ),
    ];
    const getCollapsedGridBlock = (rows, rowsVisibleBoundary, rowCount = rows.length, offset = 0) => getCollapsedGrid({
      rows,
      columns,
      rowsVisibleBoundary,
      columnsVisibleBoundary: visibleColumnBoundaries,
      getColumnWidth,
      getRowHeight,
      getColSpan,
      totalRowCount: rowCount,
      offset,
    });

    const adjustedInterval = intervalUtil.intersect(
      { start: renderRowBoundaries[0], end: renderRowBoundaries[1] },
      { start: loadedRowsStart, end: loadedRowsStart + bodyRows.length },
    );
    const adjustedBounds = [adjustedInterval.start, adjustedInterval.end];
    const bodyBottomMargin = Math.max(0, containerHeight - headerHeight - bodyHeight - footerHeight);

    const headerGrid = getCollapsedGridBlock(headerRows || [], null);
    const bodyGrid = getCollapsedGridBlock(
      bodyRows || [], adjustedBounds, totalRowCount || 1, loadedRowsStart,
    );
    const footerGrid = getCollapsedGridBlock(footerRows || [], null);

    return {
      headerGrid,
      bodyGrid,
      footerGrid,
    };
  }

  render() {
    const {
      headerRows,
      bodyRows,
      footerRows,
      columns,
      getCellColSpan,
      getRowHeight,
      containerComponent: Container,
      headTableComponent: HeadTable,
      footerTableComponent: FootTable,
      tableComponent: Table,
      headComponent: Head,
      bodyComponent: Body,
      footerComponent: Footer,
      renderRowBoundaries,
      totalRowCount,
      loadedRowsStart,
      headerHeight,
      bodyHeight,
      footerHeight,
      containerHeight,
      containerWidth,
      minColumnWidth,
      viewportLeft,
      tableRef,
    } = this.props;


    const collapsedGrids = this.getCollapsedGrids();

    return (
      <Sizer
        onSizeChange={
          this.getSizeChangeHandler(
            visibleRowBoundaries, ensureNextVirtualPage,
          )
        }
        containerComponent={Container}
        style={{
          ...(propHeight === AUTO_HEIGHT ? null : { height: `${propHeight}px` }),
        }}
        onScroll={
          this.getScrollHandler(
            visibleRowBoundaries, viewportTop, ensureNextVirtualPage,
          )
        }
      >
        {!!headerRows.length && this.renderRowsBlock('header', collapsedHeaderGrid, HeadTable, Head)}
        {this.renderRowsBlock('body', collapsedBodyGrid, Table, Body, tableRef, bodyBottomMargin, containerHeight - headerHeight)}
        {!!footerRows.length && this.renderRowsBlock('footer', collapsedFooterGrid, FootTable, Footer)}
      </Sizer>
    );
    /* tslint:enable max-line-length */
  }
}
