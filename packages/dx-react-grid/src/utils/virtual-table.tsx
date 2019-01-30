import * as React from 'react';
import { connectProps, PluginComponents } from '@devexpress/dx-react-core';
import { VirtualTableLayoutProps } from '../types';

/** @internal */
export const makeVirtualTable: (...args: any) => any = (Table, {
  VirtualLayout,
  FixedHeader,
  FixedFooter,
  defaultEstimatedRowHeight,
  defaultHeight,
}) => {
  class VirtualTable extends React.PureComponent<VirtualTableLayoutProps> {
    static FixedHeader: React.ComponentType;
    static FixedFooter: React.ComponentType;
    layoutRenderComponent: React.ComponentType<any> & { update(): void; };

    constructor(props) {
      super(props);

      this.layoutRenderComponent = connectProps(VirtualLayout, () => {
        const {
          height,
          estimatedRowHeight,
          headTableComponent,
          footerTableComponent,
        } = this.props;

        return {
          height,
          estimatedRowHeight,
          headTableComponent,
          footerTableComponent,
        };
      });
    }

    componentDidUpdate() {
      this.layoutRenderComponent.update();
    }

    render() {
      const {
        height,
        estimatedRowHeight,
        headTableComponent,
        ...restProps
      } = this.props;

      return (
        <Table layoutComponent={this.layoutRenderComponent} {...restProps} />
      );
    }
  }

  Object.values(Table.components as PluginComponents).forEach((name) => {
    VirtualTable[name] = Table[name];
  });

  VirtualTable.FixedHeader = FixedHeader;
  VirtualTable.FixedFooter = FixedFooter;

  return VirtualTable;
};