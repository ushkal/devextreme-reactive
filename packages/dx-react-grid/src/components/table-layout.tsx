/* globals requestAnimationFrame cancelAnimationFrame */

import * as React from 'react';
import {
  getAnimations,
  filterActiveAnimations,
  evalAnimations,
  TABLE_FLEX_TYPE,
  ColumnAnimationMap,
} from '@devexpress/dx-grid-core';
import { shallowEqual } from '@devexpress/dx-core';
import { TableLayoutCoreProps, TableLayoutCoreState } from '../types';

class TableLayoutBase extends React.PureComponent<TableLayoutCoreProps, TableLayoutCoreState> {
  animations: ColumnAnimationMap;
  savedScrollWidth: { [key: number]: number };
  savedOffsetWidth = -1;
  tableRef: React.RefObject<HTMLTableElement>;
  raf = -1;

  constructor(props) {
    super(props);

    this.state = {
      animationState: new Map(),
    };

    this.animations = new Map();
    this.savedScrollWidth = {};
    this.tableRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    const { columns } = this.props;
    const { columns: prevColumns } = prevProps;
    const { animationState } = this.state;

    const activeAnimationExists = !shallowEqual(columns, prevColumns)
      || !!animationState.size || !!this.animations.size;

    // NOTE: animation should be recomputed only when columns are changed or
    // an active animation is in progress. Otherwise it will be recalculated on
    // each scroll event.
    if (activeAnimationExists) {
      this.processAnimation(prevColumns);
    }
  }

  processAnimation(prevColumns) {
    const { columns } = this.props;
    const tableWidth = this.getTableWidth(prevColumns, columns);

    this.animations = getAnimations(prevColumns, columns, tableWidth, this.animations);

    cancelAnimationFrame(this.raf);
    this.raf = requestAnimationFrame(this.processAnimationFrame.bind(this));
  }

  getTableWidth(prevColumns, columns) {
    const { offsetWidth, scrollWidth } = this.tableRef.current!;
    const { animationState } = this.state;

    const widthChanged = this.savedOffsetWidth !== offsetWidth
      || !this.savedScrollWidth[columns.length];
    const columnCountChanged = columns.length !== prevColumns.length;

    if (columnCountChanged || (widthChanged && !animationState.size)) {
      this.savedScrollWidth = {};
      this.savedScrollWidth[columns.length] = scrollWidth;
      this.savedOffsetWidth = offsetWidth;
    }

    return this.savedScrollWidth[columns.length];
  }

  getColumns() {
    const { columns } = this.props;
    const { animationState } = this.state;

    let result = columns;

    const isFixedWidth = columns.filter(column => column.width === undefined).length === 0;
    if (isFixedWidth) {
      result = result.slice();
      result.push({ key: TABLE_FLEX_TYPE.toString(), type: TABLE_FLEX_TYPE });
    }

    if (animationState.size) {
      result = result
        .map(column => (animationState.has(column.key)
          ? { ...column, animationState: animationState.get(column.key) }
          : column));
    }

    return result;
  }

  processAnimationFrame() {
    const { animationState: animationComponentState } = this.state;
    this.animations = filterActiveAnimations(this.animations);

    if (!this.animations.size) {
      if (animationComponentState.size) {
        this.setState({ animationState: new Map() });
      }
      return;
    }

    const animationState = evalAnimations(this.animations);
    this.setState({ animationState });
  }

  render() {
    const {
      layoutComponent: Layout,
      minColumnWidth,
      ...restProps
    } = this.props;
    const columns = this.getColumns();
    const minWidth = columns
      .map(column => column.width || (column.type === TABLE_FLEX_TYPE ? 0 : minColumnWidth))
      .reduce((acc, width) => acc + width, 0);

    return (
      <Layout
        {...restProps}
        tableRef={this.tableRef}
        columns={columns}
        minWidth={minWidth}
        minColumnWidth={minColumnWidth}
      />
    );
  }
}

/** @internal */
export const TableLayout: React.ComponentType<TableLayoutCoreProps> = TableLayoutBase;
