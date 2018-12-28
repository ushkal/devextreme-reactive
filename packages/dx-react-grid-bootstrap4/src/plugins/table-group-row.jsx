import * as React from 'react';
import classNames from 'classnames';
import { withComponents } from '@devexpress/dx-react-core';
import { TableGroupRow as TableGroupRowBase } from '@devexpress/dx-react-grid';
import { CaptionCell as Cell } from '../templates/table-group-cell/caption-cell';
import { TableRow as RowBase } from '../templates/table-row';
import { Cell as RowSummaryCellBase } from '../templates/table-group-cell/cell';
import { Content } from '../templates/table-group-cell/content';
import { ExpandButton as Icon } from '../templates/parts/expand-button';
import { InlineSummary } from '../templates/table-group-cell/inline-summary';
import { InlineSummaryItem } from '../templates/table-group-cell/inline-summary-item';
import { TableSummaryItem as RowSummaryItem } from '../templates/table-summary-item';
import { TableStubCell as StubCell } from '../templates/table-stub-cell';


const TableGroupRowWithIndent = props => <TableGroupRowBase indentColumnWidth={33} {...props} />;
TableGroupRowWithIndent.components = TableGroupRowBase.components;

const RowSummaryCell = ({ tableColumn, className, ...props }) => (
  <RowSummaryCellBase
    {...props}
    tableColumn={tableColumn}
    className={classNames({
      'text-right': tableColumn && tableColumn.align === 'right',
      'text-center': tableColumn && tableColumn.align === 'center',
    })}
  />
);

const Row = ({ className, ...props }) => (
  <RowBase
    {...props}
    className={classNames('dx-g-bs4-cursor-pointer', className)}
  />
);

export const TableGroupRow = withComponents({
  Row, Cell, Content, Icon, InlineSummary, InlineSummaryItem, RowSummaryCell, RowSummaryItem, StubCell,
})(TableGroupRowWithIndent);

TableGroupRow.COLUMN_TYPE = TableGroupRowBase.COLUMN_TYPE;
TableGroupRow.ROW_TYPE = TableGroupRowBase.ROW_TYPE;
