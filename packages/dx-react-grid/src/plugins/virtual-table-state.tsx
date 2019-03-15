import * as React from 'react';
import { Getter, Action, Plugin, Getters } from '@devexpress/dx-react-core';
import {
  recalculateBounds, calculateRequestedRange, virtualRowsWithCache,
  trimRowsToInterval, intervalUtil,
} from '@devexpress/dx-grid-core';
import { VirtualTableStateProps, VirtualTableStateState } from '../types';

const virtualRowsComputed = (
  { start, rows, virtualRowsCache }: Getters,
) => virtualRowsWithCache(start, rows, virtualRowsCache);

const rowsComputed = ({ virtualRows }: Getters) => virtualRows.rows;

// tslint:disable-next-line: max-line-length
export class VirtualTableState extends React.PureComponent<VirtualTableStateProps, VirtualTableStateState> {
  requestTimer: any = 0;

  constructor(props) {
    super(props);

    this.state = {
      rowCount: props.rowCount || 0,
      viewportTop: 0,
      virtualRowsCache: { start: undefined, rows: [] },
      requestedPageIndex: undefined,
    };
  }

  requestNextPageAction = (
    rowIndex: number,
    { virtualRows, virtualPageSize, totalRowCount }: Getters,
  ) => {
    const { requestedPageIndex } = this.state;
    const { getRows } = this.props;

    const newBounds = recalculateBounds(rowIndex, virtualPageSize, totalRowCount);
    const loadedInterval = intervalUtil.getRowsInterval(virtualRows);

    const requestedRange = calculateRequestedRange(
      loadedInterval, newBounds, rowIndex, virtualPageSize,
    );

    const newPageIndex = requestedRange.start;
    const pageStart = newPageIndex;
    const loadCount = (requestedRange.end - requestedRange.start);

    if (newPageIndex !== requestedPageIndex && loadCount > 0) {
      if (this.requestTimer !== 0) {
        clearTimeout(this.requestTimer);
      }
      this.requestTimer = setTimeout(() => {
        getRows(pageStart, loadCount);

        const virtualRowsCache = trimRowsToInterval(virtualRows, newBounds);

        this.setState({
          virtualRowsCache,
          requestedPageIndex: newPageIndex,
        });
      }, 50);
    }
  };

  componentDidMount() {
    const { getRows } = this.props;
    getRows(0, 200);
  }

  render() {
    const { virtualRowsCache } = this.state;
    const { start, rowCount } = this.props;

    return (
      <Plugin
        name="VirtualTableState"
      >
        <Getter name="start" value={start} />
        <Getter name="virtualRowsCache" value={virtualRowsCache} />
        <Getter name="virtualPageSize" value={100} /> {/*to prop*/}
        <Getter name="totalRowCount" value={rowCount} />
        <Getter name="virtualRows" computed={virtualRowsComputed} />
        <Getter name="rows" computed={rowsComputed} />

        <Action name="requestNextPage" action={this.requestNextPageAction} />
      </Plugin>
    );
  }
}
