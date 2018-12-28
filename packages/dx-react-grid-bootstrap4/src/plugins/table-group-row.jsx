import * as React from 'react';
import { withComponents } from '@devexpress/dx-react-core';
import { TableGroupRow as TableGroupRowBase } from '@devexpress/dx-react-grid';
import { CaptionCell as Cell } from '../templates/table-group-cell/caption-cell';
import { Content } from '../templates/table-group-cell/content';
import { ExpandButton as Icon } from '../templates/parts/expand-button';
import { Row } from '../templates/table-group-cell/row';
import { InlineSummary } from '../templates/table-group-cell/inline-summary';
import { InlineSummaryItem } from '../templates/table-group-cell/inline-summary-item';
import { RowSummaryCell } from '../templates/table-group-cell/summary-cell';
import { TableSummaryItem as RowSummaryItem } from '../templates/table-summary-item';

const TableGroupRowWithIndent = props => <TableGroupRowBase indentColumnWidth={33} {...props} />;
TableGroupRowWithIndent.components = TableGroupRowBase.components;

const StubCell = RowSummaryCell;

export const TableGroupRow = withComponents({
  Row,
  Cell,
  Content,
  Icon,
  InlineSummary,
  InlineSummaryItem,
  RowSummaryCell,
  RowSummaryItem,
  StubCell,
})(TableGroupRowWithIndent);

TableGroupRow.COLUMN_TYPE = TableGroupRowBase.COLUMN_TYPE;
TableGroupRow.ROW_TYPE = TableGroupRowBase.ROW_TYPE;
