import * as React from 'react';
import {
  Getter, Action, Plugin, Getters, Actions,
} from '@devexpress/dx-react-core';
import { VirtualTableStateProps, VirtualTableStateState } from '../types';
import {
  rowIdGetter, recalculateBounds,
  calculateRequestedRange, recalculateCache, virtualRowsWithCache,
} from '@devexpress/dx-grid-core';

const rawRowsComputed = ({ rows }: Getters) => rows;

const virtualRowsComputed = (
  { start, rows, virtualRowsCache }: Getters,
) => {
  return virtualRowsWithCache(start, rows, virtualRowsCache);
};

const rowsComputed = ({ virtualRows }: Getters) => virtualRows.rows;

const rowIdGetterComputed = (
  { rows: getterRows }: Getters,
) => {
  return rowIdGetter(null!, getterRows);
};

// tslint:disable-next-line: max-line-length
export class VirtualTableState extends React.PureComponent<VirtualTableStateProps, VirtualTableStateState> {
  static defaultProps = {
    defaultOverscan: 50,
  };
  requestNextPageAction: (payload: any, getters: Getters, actions: Actions) => void;
  requestTimer: any = 0;

  constructor(props) {
    super(props);

    this.state = {
      rowCount: props.rowCount || 0,
      viewportTop: 0,
      virtualRowsCache: { start: 0, rows: [] },
      requestedPageIndex: undefined,
    };

    const getLoadedInterval = virtualRows => ({
      start: virtualRows.start,
      end: virtualRows.start + virtualRows.rows.length,
    });

    this.requestNextPageAction = (rowIndex: any,
      { virtualRows, virtualPageSize, rawRows, totalRowCount },
    ) => {
      const { requestedPageIndex, virtualRowsCache } = this.state;
      const { start, getRows } = this.props;

      const newBounds = recalculateBounds(rowIndex, virtualPageSize, totalRowCount);
      const loadedInterval = getLoadedInterval(virtualRows);

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

          // trim to new bounds
          const newCache = recalculateCache(virtualRowsCache, rawRows, start, newBounds);

          this.setState({
            requestedPageIndex: newPageIndex,
            virtualRowsCache: newCache,
          });
        }, 50);
      }
    };
  }

  componentDidMount() {
    const { getRows } = this.props;
    getRows(0, 200);
  }

  render() {
    const {
      virtualRowsCache,
    } = this.state;
    const { start, rowCount } = this.props;

    return (
      <Plugin
        name="VirtualTableState"
      >
        <Getter name="start" value={start} />
        <Getter name="virtualRowsCache" value={virtualRowsCache} />
        <Getter name="virtualPageSize" value={100} /> {/*to prop*/}
        <Getter name="totalRowCount" value={rowCount} />
        <Getter name="rawRows" computed={rawRowsComputed} /> {/*to delete*/}
        <Getter name="virtualRows" computed={virtualRowsComputed} />
        <Getter name="rows" computed={rowsComputed} />
        <Getter name="getRowId" computed={rowIdGetterComputed} /> {/*to delete*/}

        <Action name="requestNextPage" action={this.requestNextPageAction} />
      </Plugin>
    );
  }
}
