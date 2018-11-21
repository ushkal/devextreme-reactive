import * as React from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { withRef } from '../utils/with-ref';

const styles = {
  root: {
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    // NOTE: fix sticky positioning in Safari
    width: '100%',
  },
};

class TableContainerBase extends React.PureComponent {
  render() {
    const {
      children, classes, className, ...restProps
    } = this.props;

    return (
      <div
        className={classNames(classes.root, className)}
        {...restProps}
      >
        {children}
      </div>
    );
  }
}

TableContainerBase.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
};

TableContainerBase.defaultProps = {
  className: undefined,
};

export const TableContainer = withRef(
  withStyles(styles, { name: 'TableContainer' })(TableContainerBase),
);
