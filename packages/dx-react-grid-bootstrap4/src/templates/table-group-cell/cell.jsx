import * as React from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';

export const Cell = ({
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
  className: PropTypes.string,
  colSpan: PropTypes.number,
  onToggle: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

Cell.defaultProps = {
  className: undefined,
  colSpan: 1,
  onToggle: () => {},
  children: undefined,
};
