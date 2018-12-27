import * as React from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';

export const Cell = ({
  row, column,
  tableRow, tableColumn,
  className,
  onToggle, children,
  ...restProps
}) => {
  const handleClick = () => onToggle();

  return (
    <td
      className={classNames('dx-g-bs4-cursor-pointer', className)}
      onClick={handleClick}
      {...restProps}
    >
      {children}
    </td>
  );
};

Cell.propTypes = {
  row: PropTypes.any,
  column: PropTypes.object,
  className: PropTypes.string,
  colSpan: PropTypes.number,
  onToggle: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

Cell.defaultProps = {
  row: {},
  column: {},
  className: undefined,
  colSpan: 1,
  onToggle: () => {},
  children: undefined,
};
