import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Cell } from './cell';

export const CaptionCell = ({
  row, column,
  expanded, onToggle,
  children, tableRow, tableColumn,
  iconComponent: Icon, contentComponent: Content,
  inlineSummaryComponent: InlineSummary,
  inlineSummaryItemComponent: InlineSummaryItem,
  inlineSummaries,
  getMessage,
  ...restProps
}) => {
  const handleClick = () => onToggle();

  return (
    <Cell
      onToggle={handleClick}
      {...restProps}
    >
      <Icon
        expanded={expanded}
        onToggle={onToggle}
        className="mr-2"
      />
      <Content
        column={column}
        row={row}
      >
        {children}
      </Content>
      {
        inlineSummaries.length ? (
          <InlineSummary
            column={column}
            inlineSummaries={inlineSummaries}
            getMessage={getMessage}
            inlineSummaryItemComponent={InlineSummaryItem}
          />
        ) : null
      }
    </Cell>
  );
};

CaptionCell.propTypes = {
  contentComponent: PropTypes.func.isRequired,
  iconComponent: PropTypes.func.isRequired,
  className: PropTypes.string,
  colSpan: PropTypes.number,
  row: PropTypes.any,
  column: PropTypes.object,
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  tableRow: PropTypes.object,
  tableColumn: PropTypes.object,
};

CaptionCell.defaultProps = {
  className: undefined,
  colSpan: 1,
  row: {},
  column: {},
  expanded: false,
  onToggle: () => {},
  children: undefined,
  tableRow: undefined,
  tableColumn: undefined,
};
