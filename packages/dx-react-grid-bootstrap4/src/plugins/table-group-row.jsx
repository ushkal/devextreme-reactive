import * as React from 'react';
import { withComponents } from '@devexpress/dx-react-core';
import { TableGroupRow as TableGroupRowBase, InlineSummaryItem } from '@devexpress/dx-react-grid';
import { CaptionCell as Cell } from '../templates/table-group-cell/caption-cell';
import { Content } from '../templates/table-group-cell/content';
import { ExpandButton as Icon } from '../templates/parts/expand-button';
import { Row } from '../templates/table-group-cell/row';
import { InlineSummary } from '../templates/table-group-cell/inline-summary';
import { SummaryCell } from '../templates/table-group-cell/summary-cell';
import { TableSummaryItem as SummaryItem } from '../templates/table-summary-item';

const TableGroupRowWithIndent = props => <TableGroupRowBase indentColumnWidth={33} {...props} />;
TableGroupRowWithIndent.components = TableGroupRowBase.components;

const StubCell = SummaryCell;

export const TableGroupRow = withComponents({
  Row,
  Cell,
  Content,
  Icon,
  InlineSummary,
  InlineSummaryItem,
  SummaryCell,
  SummaryItem,
  StubCell,
})(TableGroupRowWithIndent);

TableGroupRow.COLUMN_TYPE = TableGroupRowBase.COLUMN_TYPE;
TableGroupRow.ROW_TYPE = TableGroupRowBase.ROW_TYPE;
