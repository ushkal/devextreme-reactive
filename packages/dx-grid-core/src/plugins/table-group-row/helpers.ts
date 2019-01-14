import { TABLE_GROUP_TYPE } from './constants';
import { TableRow, TableColumn, Groupings } from '../../types';

export const isGroupTableCell = (
  tableRow: TableRow,
  tableColumn: TableColumn,
) => tableRow.type === TABLE_GROUP_TYPE && tableColumn.type === TABLE_GROUP_TYPE
  && tableColumn.column
  && tableColumn.column.name === tableRow.row.groupedBy;

export const isGroupIndentTableCell = (
  tableRow: TableRow,
  tableColumn: TableColumn,
  grouping: Groupings,
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
