import * as React from 'react';
import { withComponents } from '@devexpress/dx-react-core';
import { TableGroupRow as TableGroupRowBase } from '@devexpress/dx-react-grid';
import { Cell } from '../templates/table-group-cell/cell';
import { TableRow as Row } from '../templates/table-row';
import { Content } from '../templates/table-group-cell/content';
import { ExpandButton as Icon } from '../templates/parts/expand-button';
import { InlineSummary } from '../templates/table-group-cell/inline-summary';
import { InlineSummaryItem } from '../templates/table-group-cell/inline-summary-item';
import { TableSummaryItem as RowSummaryItem } from '../templates/table-summary-item';


const TableGroupRowWithIndent = props => <TableGroupRowBase indentColumnWidth={33} {...props} />;
TableGroupRowWithIndent.components = TableGroupRowBase.components;


export const TableGroupRow = withComponents({
  Row, Cell, Content, Icon, InlineSummary, InlineSummaryItem, RowSummaryItem,
})(TableGroupRowWithIndent);

TableGroupRow.COLUMN_TYPE = TableGroupRowBase.COLUMN_TYPE;
TableGroupRow.ROW_TYPE = TableGroupRowBase.ROW_TYPE;
