import * as React from 'react';
import * as PropTypes from 'prop-types';
import TableRowMUI from '@material-ui/core/TableRow';
import { withRef } from '../utils/with-ref';

const TableStubRowBase = ({
  children,
  tableRow,
  ...restProps
}) => (
  <TableRowMUI
    {...restProps}
  >
    {children}
  </TableRowMUI>
);

TableStubRowBase.propTypes = {
  children: PropTypes.node,
  tableRow: PropTypes.object,
};

TableStubRowBase.defaultProps = {
  children: undefined,
  tableRow: undefined,
};

export const TableStubRow = withRef(TableStubRowBase);
