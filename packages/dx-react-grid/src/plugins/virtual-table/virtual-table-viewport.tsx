import * as React from 'react';
import { findDOMNode } from 'react-dom';
import {
  Plugin, Template, TemplateConnector,
  Sizer, TemplatePlaceholder,
} from '@devexpress/dx-react-core';
import { isEdgeBrowser } from '@devexpress/dx-core';
import {
  TABLE_STUB_TYPE, getVisibleRowsBounds, getRowsRenderBoundary,
} from '@devexpress/dx-grid-core';
import { TableLayoutProps } from '../../types';



export class VirtualTableViewport extends React.PureComponent<any, any> {
  constructor(props) {
    super(props);



    this.rowRefs = new Map();
    this.blockRefs = new Map();
    this.registerRowRef = this.registerRowRef.bind(this);
    this.registerBlockRef = this.registerBlockRef.bind(this);

    this.getRowHeight = this.getRowHeight.bind(this);

    this.handleContainerSizeChange = this.handleContainerSizeChange.bind(this);
    this.handleTableUpdate = this.handleTableUpdate.bind(this);
  }

  getScrollHandler = (
    currentVirtualPageBoundary, viewportTop, ensureNextVirtualPage,
  ) => (
      e => this.updateViewport(e, currentVirtualPageBoundary, viewportTop, ensureNextVirtualPage)
  )

  getSizeChangeHandler = (currentVirtualPageBoundary, requestNextPage) => (
    e => this.handleContainerSizeChange(currentVirtualPageBoundary, requestNextPage, e)
  )

  componentDidMount() {

  }



  handleContainerSizeChange(currentVirtualPageBoundary, requestNextPage, { width, height }) {
    this.setState({ containerWidth: width, containerHeight: height });
  }

  handleTableUpdate() {

  }





  render() {
    const {
      height: propHeight,
      estimatedRowHeight,
    } = this.props;

    const {
      containerHeight,
      containerWidth,
      headerHeight,
      bodyHeight,
      footerHeight,
    } = this.state;

    return (
      <Plugin name="VirtualTableViewport">
        <Template name="tableLayout">
            {(params: TableLayoutProps) => {
              return (
                <TemplateConnector>
                  {(
                    { availableRowCount, loadedRowsStart, tableBodyRows },
                    { ensureNextVirtualPage },
                  ) => {
                    const { viewportLeft, viewportTop } = this.state;
                    const visibleRowBoundaries = getVisibleRowsBounds(
                      this.state, { loadedRowsStart, tableBodyRows },
                      estimatedRowHeight, this.getRowHeight,
                    );
                    const renderRowBoundaries = getRowsRenderBoundary(
                      loadedRowsStart + tableBodyRows.length,
                      [visibleRowBoundaries.start, visibleRowBoundaries.end],
                    );
                    const totalRowCount = availableRowCount || tableBodyRows.length;

                    return (
                      <TemplatePlaceholder
                        params={{
                          ...params,
                          blockRefsHandler: this.registerBlockRef,
                          rowRefsHandler: this.registerRowRef,
                          onUpdate: this.handleTableUpdate,
                          getRowHeight: this.getRowHeight,
                          renderRowBoundaries,
                          headerHeight,
                          bodyHeight,
                          footerHeight,
                          containerHeight,
                          containerWidth,
                          viewportLeft,
                          totalRowCount,
                          loadedRowsStart,
                        }}
                      />
                    );
                  }}
                </TemplateConnector>
              );
            }}
          </Template>
      </Plugin>
    );
  }
}
