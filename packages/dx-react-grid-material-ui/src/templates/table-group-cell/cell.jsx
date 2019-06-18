import * as React from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  cell: {
    cursor: 'pointer',
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingTop: (theme.spacing.unit / 2) - 1,
  },
});

const CellBase = ({
  contentComponent: Content,
  iconComponent: Icon,
  inlineSummaryComponent: InlineSummary,
  inlineSummaryItemComponent: InlineSummaryItem,
  inlineSummaries, getMessage,
  style, colSpan, row,
  column, expanded,
  onToggle,
  classes, children,
  className, tableRow,
  tableColumn, ...restProps
}) => {
  const handleClick = () => onToggle();

  return (
    <TableCell
      colSpan={colSpan}
      style={style}
      className={classNames(classes.cell, className)}
      onClick={handleClick}
      {...restProps}
    >
      <Icon
        expanded={expanded}
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
          inlineSummaries={inlineSummaries}
          getMessage={getMessage}
          inlineSummaryItemComponent={InlineSummaryItem}
        />
      ) : null
    }
    </TableCell>
  );
};

CellBase.propTypes = {
  contentComponent: PropTypes.func.isRequired,
  iconComponent: PropTypes.func.isRequired,
  inlineSummaryComponent: PropTypes.func.isRequired,
  inlineSummaryItemComponent: PropTypes.func.isRequired,
  style: PropTypes.object,
  colSpan: PropTypes.number,
  row: PropTypes.any,
  column: PropTypes.object,
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
  classes: PropTypes.object.isRequired,
  getMessage: PropTypes.func.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  tableRow: PropTypes.object,
  tableColumn: PropTypes.object,
  inlineSummaries: PropTypes.array,
};

CellBase.defaultProps = {
  style: null,
  colSpan: 1,
  row: {},
  column: {},
  expanded: false,
  inlineSummaries: [],
  onToggle: () => {},
  children: undefined,
  className: undefined,
  tableRow: undefined,
  tableColumn: undefined,
};

export const Cell = withStyles(styles, { name: 'TableGroupCell' })(CellBase);
