import * as React from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import { TableRow as RowBase } from '../table-row';

export const Row = ({ className, ...props }) => (
  <RowBase
    {...props}
    className={classNames('dx-g-bs4-cursor-pointer', className)}
  />
);

Row.propTypes = {
  className: PropTypes.string,
};

Row.defaultProps = {
  className: undefined,
};
