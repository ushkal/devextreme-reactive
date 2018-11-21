import * as React from 'react';
import RootRef from '@material-ui/core/RootRef';

export const withRef = (Component) => {
  class WithRef extends React.PureComponent {
    render() {
      const { innerRef, ...restProps } = this.props;

      return (
        <RootRef rootRef={innerRef}>
          <Component {...restProps} />
        </RootRef>
      );
    }
  }
  return WithRef;
};
