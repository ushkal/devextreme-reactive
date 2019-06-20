import * as React from 'react';
import { Getter, Action, Plugin, Getters, Actions } from '@devexpress/dx-react-core';

const rowsComputed = ({ rows, loadedRows }: Getters) => {
  if (rows !== undefined) {
    // tslint:disable-next-line: no-console
    console.warn('Grid.rows property cannot be used in junction with getRows function');
  }
  return
};

class VirtualScrollingStateBase extends React.PureComponent<any, any> {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    const { loadedRows } = this.props;

    return (
      <Plugin name="VirtualScrollingState">
        <Getter name="isDataRemote" value />
        <Getter name="loadedRows" value={loadedRows} />
        <Getter name="rows" computed={} />
        {/* <Getter name="isDataLoading" value={loading} /> */}
      </Plugin>
    )
  }
}

export const VirtualScrollingState = VirtualScrollingStateBase;
