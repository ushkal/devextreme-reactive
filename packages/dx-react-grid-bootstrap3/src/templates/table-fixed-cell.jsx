import React, { useContext } from 'react';
import * as PropTypes from 'prop-types';
import { StyleContext } from './layout';

export const FixedCell = React.memo(({
  component: CellPlaceholder,
  side,
  showLeftDivider,
  showRightDivider,
  style,
  position,
  ...restProps
}) => {
  const { backgroundColor, borderColor, stickyPosition } = useContext(StyleContext);

  return (
    <CellPlaceholder
      style={{
        ...style,
        position: stickyPosition,
        backgroundClip: 'padding-box',
        zIndex: 300,
        backgroundColor,
        [side]: position,
        ...borderColor ? {
          ...showLeftDivider ? { borderLeft: `1px solid ${borderColor}` } : null,
          ...showRightDivider ? { borderRight: `1px solid ${borderColor}` } : null,
        } : null,
      }}
      {...restProps}
    />
  );
});

FixedCell.propTypes = {
  style: PropTypes.object,
  component: PropTypes.func.isRequired,
  side: PropTypes.string.isRequired,
  position: PropTypes.number,
  showLeftDivider: PropTypes.bool,
  showRightDivider: PropTypes.bool,
};

FixedCell.defaultProps = {
  style: null,
  showLeftDivider: false,
  showRightDivider: false,
  position: undefined,
};
