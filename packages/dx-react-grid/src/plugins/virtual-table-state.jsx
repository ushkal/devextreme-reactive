import * as React from 'react';
import {
  Plugin, Getter,
} from '@devexpress/dx-react-core';

export class VirtualTableState extends React.PureComponent {
  constructor(props) {
    super(props);

  }

  render() {
    const {
      rowRefs,
      blockRefs,
      viewportLeft,
      viewportTop,
      width,
      height,
    } = this.props;
    return (
      <Plugin name="VirtualTableState">
        <Getter name="headerBoundary" value={[0, 11]} />
      </Plugin>
    );
  }
}
