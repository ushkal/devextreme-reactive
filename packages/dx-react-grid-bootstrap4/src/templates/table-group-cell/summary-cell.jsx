import * as React from 'react';
import { TableCell } from '../table-cell';

export const RowSummaryCell = ({ onToggle, ...props }) => (
  <TableCell
    {...props}
    onClick={onToggle}
  />
);
