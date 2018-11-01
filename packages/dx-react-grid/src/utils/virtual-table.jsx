import * as React from 'react';
import { findDOMNode } from 'react-dom';
import * as PropTypes from 'prop-types';
import {
  connectProps, Plugin, TemplatePlaceholder, Sizer, Template,
  Getter,
  TemplateConnector,
} from '@devexpress/dx-react-core';
// import { VirtualTableState } from '../plugins/virtual-table-state';
import {
  getColumnsVisibleBoundary,
  getRowsVisibleBoundary,
  TABLE_FLEX_TYPE,
  TABLE_STUB_TYPE,
} from '@devexpress/dx-grid-core';

const AUTO_HEIGHT = 'auto';

export const makeVirtualTable = (Table, {
  VirtualLayout,
  FixedHeader,
  FixedFooter,
  defaultEstimatedRowHeight,
  defaultHeight,
  minColumnWidth,
}) => {
  class VirtualTable extends React.PureComponent {
    constructor(props) {
      super(props);

      this.state = {
        rowHeights: new Map(),
        viewportTop: 0,
        viewportLeft: 0,
        width: 800,
        height: 600,
      };

      const {
        height,
        estimatedRowHeight,
        headTableComponent,
        footerTableComponent,
      } = props;
      this.layoutRenderComponent = connectProps(VirtualLayout, () => ({
        height,
        estimatedRowHeight,
        headTableComponent,
        footerTableComponent,
      }));

      this.rowRefs = new Map();
      this.blockRefs = new Map();
      this.registerRowRef = this.registerRowRef.bind(this);
      this.registerBlockRef = this.registerBlockRef.bind(this);
      this.getRowHeight = this.getRowHeight.bind(this);
      this.updateViewport = this.updateViewport.bind(this);
      this.handleContainerSizeChange = this.handleContainerSizeChange.bind(this);
      this.handleTableUpdate = this.handleTableUpdate.bind(this);
      this.getRowHeight = this.getRowHeight.bind(this);
    }

    componentDidUpdate() {
      this.layoutRenderComponent.update();
    }

    getRowHeight(row) {
      const { rowHeights } = this.state;
      const { estimatedRowHeight } = this.props;
      const storedHeight = rowHeights.get(row.key);
      if (storedHeight !== undefined) return storedHeight;
      if (row.height) return row.height;
      return estimatedRowHeight;
    }

    registerRowRef(row, ref) {
      if (ref === null) {
        this.rowRefs.delete(row);
      } else {
        this.rowRefs.set(row, ref);
      }
    }

    registerBlockRef(name, ref) {
      if (ref === null) {
        this.blockRefs.delete(name);
      } else {
        this.blockRefs.set(name, ref);
      }
    }

    updateViewport(e) {
      const node = e.target;

      // NOTE: prevent nested scroll to update viewport
      if (node !== e.currentTarget) {
        return;
      }

      // NOTE: prevent iOS to flicker in bounces and correct rendering on high dpi screens
      const nodeHorizontalOffset = parseInt(node.scrollLeft + node.clientWidth, 10);
      const nodeVerticalOffset = parseInt(node.scrollTop + node.clientHeight, 10);
      if (node.scrollTop < 0
        || node.scrollLeft < 0
        || nodeHorizontalOffset > Math.max(node.scrollWidth, node.clientWidth)
        || nodeVerticalOffset > Math.max(node.scrollHeight, node.clientHeight)) {
        return;
      }

      this.setState({
        viewportTop: node.scrollTop,
        viewportLeft: node.scrollLeft,
      });
    }

    handleContainerSizeChange({ width, height }) {
      this.setState({ width, height });
    }

    handleTableUpdate() {
      this.storeRowHeights();
      this.storeBloksHeights();
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

    storeBloksHeights() {
      const headerHeight = this.blockRefs.get('header')
        // eslint-disable-next-line react/no-find-dom-node
        ? findDOMNode(this.blockRefs.get('header')).getBoundingClientRect().height
        : 0;

      const bodyHeight = this.blockRefs.get('body')
        // eslint-disable-next-line react/no-find-dom-node
        ? findDOMNode(this.blockRefs.get('body')).getBoundingClientRect().height
        : 0;

      const footerHeight = this.blockRefs.get('footer')
        // eslint-disable-next-line react/no-find-dom-node
        ? findDOMNode(this.blockRefs.get('footer')).getBoundingClientRect().height
        : 0;

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

    render() {
      const {
        height: propHeight,
        estimatedRowHeight,
        headTableComponent,
        // minColumnWidth,
        ...restProps
      } = this.props;

      const {
        width,
        height,
        viewportTop,
        viewportLeft,
        headerHeight,
        bodyHeight,
        footerHeight,
      } = this.state;

      // const stateProps = {
      //   width,
      //   height,
      //   viewportTop,
      //   viewportLeft,
      // };

      const getColumnWidth = column => (column.type === TABLE_FLEX_TYPE
        ? 0
        : column.width || minColumnWidth);

      const visibleBoundariesComputed = ({
        rows,
        columns,
      }) => {
        const getBoundary = (top, partHeight) => ({
          columns: getColumnsVisibleBoundary(columns, viewportLeft, width, getColumnWidth),
          rows: getRowsVisibleBoundary(rows, top, partHeight, this.getRowHeight),
        });



        return {
          headerBoundary: getBoundary(0, headerHeight),
          bodyBoundary: getBoundary(viewportTop, height - headerHeight - footerHeight),
          footerBoundary: getBoundary(0, footerHeight),
        };
      };

      return (
        <Plugin name="VirtualTable">
          <Getter name="visibleBoundaries" computed={visibleBoundariesComputed} />
          <Table layoutComponent={this.layoutRenderComponent} {...restProps} />

          <Template name="tableLayout">
            {params => (
              <TemplateConnector>
                {(
                  { visibleBoundaries },
                ) => {
                  const {
                    containerComponent: Container,
                  } = params;
                  console.log('visibleBoundaries', visibleBoundaries)

                  return (
                    <Sizer
                      onSizeChange={this.handleContainerSizeChange}
                      containerComponent={Container}
                      style={{
                        ...(propHeight === AUTO_HEIGHT ? null : { height: `${propHeight}px` }),
                      }}
                      onScroll={this.updateViewport}
                    >
                      <TemplatePlaceholder
                        params={{
                          ...params,
                          blockRefsHandler: this.registerBlockRef,
                          rowRefsHandler: this.registerRowRef,
                          onUpdate: this.handleTableUpdate,
                          visibleBoundaries,
                          getRowHeight: this.getRowHeight,
                          getColumnWidth,
                          headerHeight,
                          bodyHeight,
                          footerHeight,
                          height,
                        }}
                      />
                    </Sizer>);
                }}
              </TemplateConnector>
            )}
          </Template>
        </Plugin>
      );
    }
  }

  VirtualTable.propTypes = {
    estimatedRowHeight: PropTypes.number,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['auto'])]),
    headTableComponent: PropTypes.func,
    footerTableComponent: PropTypes.func,
  };

  VirtualTable.defaultProps = {
    estimatedRowHeight: defaultEstimatedRowHeight,
    height: defaultHeight,
    headTableComponent: FixedHeader,
    footerTableComponent: FixedFooter,
  };

  Object.values(Table.components).forEach((name) => {
    VirtualTable[name] = Table[name];
  });

  VirtualTable.FixedHeader = FixedHeader;
  VirtualTable.FixedFooter = FixedFooter;

  return VirtualTable;
};
