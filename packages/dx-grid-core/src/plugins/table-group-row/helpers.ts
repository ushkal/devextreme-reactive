import { PureComputed } from '@devexpress/dx-core';
import { TABLE_GROUP_TYPE } from './constants';
import { TableRow, TableColumn, IsSpecificCellFn, Grouping, GroupSummaryItem } from '../../types';
import { getGroupInlineSummaries } from '../..';

export const isGroupTableCell: IsSpecificCellFn = (
  tableRow, tableColumn,
) => !!(tableRow.type === TABLE_GROUP_TYPE && tableColumn.type === TABLE_GROUP_TYPE
  && tableColumn.column
  && tableColumn.column.name === tableRow.row.groupedBy);

export const isGroupIndentTableCell: PureComputed<[TableRow, TableColumn, Grouping[]], boolean> = (
  tableRow, tableColumn, grouping,
) => {
  if (tableRow.type !== TABLE_GROUP_TYPE || tableColumn.type !== TABLE_GROUP_TYPE) return false;
  if (tableColumn.column && tableRow.row.groupedBy === tableColumn.column.name) return false;
  const rowGroupIndex = grouping.findIndex(
    columnGrouping => columnGrouping.columnName === tableRow.row.groupedBy,
  );
  const columnGroupIndex = grouping.findIndex(
    columnGrouping => !!tableColumn.column && columnGrouping.columnName === tableColumn.column.name,
  );
  return columnGroupIndex < rowGroupIndex;
};
export const isGroupTableRow = (tableRow: TableRow) => tableRow.type === TABLE_GROUP_TYPE;

export const columnHasGroupRowSummary: PureComputed<[TableColumn, GroupSummaryItem[]], boolean> = (
  tableColumn, groupSummaryItems,
) => (
  !!groupSummaryItems
    .find(summaryItem => (
      summaryItem.showInGroupRow
        && summaryItem.columnName === (tableColumn.column && tableColumn.column.name)
    ))
);

export const isRowSummaryCell: PureComputed<
  [TableRow, TableColumn, Grouping[], GroupSummaryItem[]], boolean
> = (
  tableRow, tableColumn, grouping, groupSummaryItems,
) => (
  columnHasGroupRowSummary(tableColumn, groupSummaryItems)
  && !isGroupIndentTableCell(tableRow, tableColumn, grouping)
);

export const isGroupRowOrdinaryCell: IsSpecificCellFn = (tableRow, tableColumn) => (
  isGroupTableRow(tableRow) && !isGroupTableCell(tableRow, tableColumn)
);

export const isPreviousCellContainSummary: PureComputed<
  [TableRow, TableColumn, TableColumn[], Grouping[], GroupSummaryItem[]], boolean
> = (
  tableRow, tableColumn, tableColumns, grouping, groupSummaryItems,
) => {
  const columnIndex = tableColumns.indexOf(tableColumn);
  return columnIndex > 0 && isRowSummaryCell(
    tableRow, tableColumns[columnIndex - 1], grouping, groupSummaryItems,
  );
};
