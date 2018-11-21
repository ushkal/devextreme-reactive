import * as React from 'react';
import * as PropTypes from 'prop-types';
import TableRowMUI from '@material-ui/core/TableRow';
import { withRef } from '../utils/with-ref';

export const TableRowBase = ({
  children,
  row, tableRow,
  ...restProps
}) => (
  <TableRowMUI
    {...restProps}
  >
    {children}
  </TableRowMUI>
);

TableRowBase.propTypes = {
  children: PropTypes.node,
  row: PropTypes.any,
  tableRow: PropTypes.object,
};

TableRowBase.defaultProps = {
  children: undefined,
  row: undefined,
  tableRow: undefined,
};

export const TableRow = withRef(TableRowBase);
