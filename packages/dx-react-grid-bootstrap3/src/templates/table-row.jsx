import * as React from 'react';
import * as PropTypes from 'prop-types';

export const TableRow = ({
  children, row, tableRow, innerRef,
  ...restProps
}) => (
  <tr
    ref={innerRef}
    {...restProps}
  >
    {children}
  </tr>
);

TableRow.propTypes = {
  children: PropTypes.node,
  row: PropTypes.any,
  tableRow: PropTypes.object,
};

TableRow.defaultProps = {
  children: undefined,
  row: undefined,
  tableRow: undefined,
};
