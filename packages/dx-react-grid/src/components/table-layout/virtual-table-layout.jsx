import * as React from 'react';
import * as PropTypes from 'prop-types';
import { RefHolder } from '@devexpress/dx-react-core';
import {
  getCollapsedGrid,
} from '@devexpress/dx-grid-core';
import { ColumnGroup } from './column-group';

export class VirtualTableLayout extends React.PureComponent {
  componentDidMount() {
    const { onUpdate } = this.props;
    onUpdate();
  }

  componentDidUpdate() {
    const { onUpdate } = this.props;
    onUpdate();
  }

  renderRowsBlock(name, collapsedGrid, Table, Body, marginBottom) {
    const {
      minWidth,
      rowComponent: Row,
      cellComponent: Cell,
      blockRefsHandler,
      rowRefsHandler,
    } = this.props;

    return (
      <RefHolder
        ref={ref => blockRefsHandler(name, ref)}
      >
        <Table
          style={{ minWidth: `${minWidth}px`, ...marginBottom ? { marginBottom: `${marginBottom}px` } : null }}
        >
          <ColumnGroup
            columns={collapsedGrid.columns}
          />
          <Body>
            {collapsedGrid.rows.map((visibleRow) => {
              const { row, cells = [] } = visibleRow;
              return (
                <RefHolder
                  key={row.key}
                  ref={ref => rowRefsHandler(row, ref)}
                >
                  <Row
                    tableRow={row}
                    style={row.height !== undefined
                      ? { height: `${row.height}px` }
                      : undefined}
                  >
                    {cells.map((cell) => {
                      const { column } = cell;
                      return (
                        <Cell
                          key={column.key}
                          tableRow={row}
                          tableColumn={column}
                          style={column.animationState}
                          colSpan={cell.colSpan}
                        />
                      );
                    })}
                  </Row>
                </RefHolder>
              );
            })}
          </Body>
        </Table>
      </RefHolder>
    );
  }

  render() {
    const {
      headerRows,
      bodyRows,
      footerRows,
      columns,
      getCellColSpan, // ^ getter in table template
      minColumnWidth, // table layout component [theme]
      height: propHeight,
      headTableComponent: HeadTable,
      footerTableComponent: FootTable, // ^ VirtualTable connected props
      // containerComponent: Container,
      tableComponent: Table,
      headComponent: Head,
      bodyComponent: Body,
      footerComponent: Footer, // ^ Table component
      visibleBoundaries,
      getRowHeight,
      getColumnWidth,
      headerHeight,
      bodyHeight,
      footerHeight,
      height,
    } = this.props;

    const getColSpan = (
      tableRow, tableColumn,
    ) => getCellColSpan({ tableRow, tableColumn, tableColumns: columns });
    const getCollapsedGridBlock = (rows, rowsVisibleBoundary) => getCollapsedGrid({
      rows,
      columns,
      rowsVisibleBoundary,
      columnsVisibleBoundary: visibleBoundaries.columns,
      getColumnWidth,
      getRowHeight,
      getColSpan,
    });
    const collapsedHeaderGrid = getCollapsedGridBlock(headerRows, visibleBoundaries.headerRows);
    const collapsedBodyGrid = getCollapsedGridBlock(bodyRows, visibleBoundaries.bodyRows);
    const collapsedFooterGrid = getCollapsedGridBlock(footerRows, visibleBoundaries.footerRows);
    const bodyBottomMargin = Math.max(0, height - headerHeight - bodyHeight - footerHeight);
    console.log(height, headerHeight, bodyHeight, footerHeight);
    return (
      <React.Fragment>
        {!!headerRows.length && this.renderRowsBlock('header', collapsedHeaderGrid, HeadTable, Head)}
        {this.renderRowsBlock('body', collapsedBodyGrid, Table, Body, bodyBottomMargin)}
        {!!footerRows.length && this.renderRowsBlock('footer', collapsedFooterGrid, FootTable, Footer)}
      </React.Fragment>
    );
  }
}

VirtualTableLayout.propTypes = {
  minWidth: PropTypes.number.isRequired,
  minColumnWidth: PropTypes.number.isRequired,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['auto'])]).isRequired,
  headerRows: PropTypes.array,
  bodyRows: PropTypes.array.isRequired,
  footerRows: PropTypes.array,
  columns: PropTypes.array.isRequired,
  cellComponent: PropTypes.func.isRequired,
  rowComponent: PropTypes.func.isRequired,
  bodyComponent: PropTypes.func.isRequired,
  headComponent: PropTypes.func,
  footerComponent: PropTypes.func,
  tableComponent: PropTypes.func.isRequired,
  headTableComponent: PropTypes.func,
  footerTableComponent: PropTypes.func,
  containerComponent: PropTypes.func.isRequired,
  estimatedRowHeight: PropTypes.number.isRequired,
  getCellColSpan: PropTypes.func.isRequired,
};

VirtualTableLayout.defaultProps = {
  headerRows: [],
  footerRows: [],
  headComponent: () => null,
  headTableComponent: () => null,
  footerComponent: () => null,
  footerTableComponent: () => null,
};
