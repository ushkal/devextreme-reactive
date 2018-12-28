import * as React from 'react';
import classNames from 'classnames';
import { TableRow as RowBase } from '../table-row';

export const Row = ({ className, ...props }) => (
  <RowBase
    {...props}
    className={classNames('dx-g-bs4-cursor-pointer', className)}
  />
);
