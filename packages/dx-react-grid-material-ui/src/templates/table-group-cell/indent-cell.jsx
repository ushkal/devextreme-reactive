import * as React from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';
import { getStickyCellStyle, getBorder } from '../utils';

const styles = theme => ({
  indentCell: {
    ...getStickyCellStyle(theme),
    borderBottom: getBorder(theme),
  },
});

const IndentCellBase = ({
  left,
  tableRow,
  tableColumn,
  row, column,
  style, className, classes,
  ...restProps
}) => (
  <TableCell
    className={classNames(classes.indentCell, className)}
    style={{ ...style, left }}
    {...restProps}
  />
);

IndentCellBase.propTypes = {
  left: PropTypes.string,
  tableRow: PropTypes.object,
  tableColumn: PropTypes.object,
  row: PropTypes.any,
  column: PropTypes.object,
  style: PropTypes.object,
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
};

IndentCellBase.defaultProps = {
  left: '',
  tableRow: undefined,
  tableColumn: undefined,
  row: {},
  column: {},
  style: null,
  className: undefined,
};

export const IndentCell = withStyles(styles)(IndentCellBase);
