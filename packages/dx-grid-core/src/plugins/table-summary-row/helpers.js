import { TABLE_TOTAL_SUMMARY_TYPE, TABLE_GROUP_SUMMARY_TYPE, TABLE_TREE_SUMMARY_TYPE } from './constants';
import { TABLE_DATA_TYPE } from '../table/constants';

export const isTotalSummaryTableCell = (
  tableRow, tableColumn,
) => tableRow.type === TABLE_TOTAL_SUMMARY_TYPE && tableColumn.type === TABLE_DATA_TYPE;
export const isGroupSummaryTableCell = (
  tableRow, tableColumn,
) => tableRow.type === TABLE_GROUP_SUMMARY_TYPE && tableColumn.type === TABLE_DATA_TYPE;
export const isTreeSummaryTableCell = (
  tableRow, tableColumn,
) => tableRow.type === TABLE_TREE_SUMMARY_TYPE && tableColumn.type === TABLE_DATA_TYPE;
export const isTotalSummaryTableRow = tableRow => tableRow.type === TABLE_TOTAL_SUMMARY_TYPE;
export const isGroupSummaryTableRow = tableRow => tableRow.type === TABLE_GROUP_SUMMARY_TYPE;
export const isTreeSummaryTableRow = tableRow => tableRow.type === TABLE_TREE_SUMMARY_TYPE;

export const getColumnSummaries = (
  summaryItems, columnName, summaryValues, predicate = () => true,
) => (
  summaryItems
    .map((item, index) => [item, index])
    .filter(([item]) => item.columnName === columnName && predicate(item))
    .map(([item, index]) => ({ type: item.type, value: summaryValues[index] }))
);

const isInlineGroupSummary = summaryItem => (
  summaryItem.showInGroupCaption || summaryItem.showInGroupRow
);

export const getGroupInlineSummaries = (summaryItems, tableColumns, summaryValues) => {
  if (!summaryItems.some(isInlineGroupSummary)) {
    return [];
  }

  return tableColumns.reduce((acc, col) => {
    const colName = col.column.name;
    const summaries = getColumnSummaries(
      summaryItems, colName, summaryValues, item => item.showInGroupCaption,
    );
    if (summaries.length) {
      acc.push({
        column: col.column,
        summaries,
      });
    }

    return acc;
  }, []);
};
