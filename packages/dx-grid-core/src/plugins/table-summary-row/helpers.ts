import { PureComputed } from '@devexpress/dx-core';
import {
  TABLE_TOTAL_SUMMARY_TYPE, TABLE_GROUP_SUMMARY_TYPE, TABLE_TREE_SUMMARY_TYPE,
} from './constants';
import { TABLE_DATA_TYPE } from '../table/constants';
import {
  GetColumnSummariesFn, IsSpecificCellFn, IsSpecificRowFn, SummaryItem,
  GetGroupInlineSummariesFn, InlineSummary,
} from '../../types';

export const isTotalSummaryTableCell: IsSpecificCellFn = (
  tableRow, tableColumn,
) => tableRow.type === TABLE_TOTAL_SUMMARY_TYPE && tableColumn.type === TABLE_DATA_TYPE;
export const isGroupSummaryTableCell: IsSpecificCellFn = (
  tableRow, tableColumn,
) => tableRow.type === TABLE_GROUP_SUMMARY_TYPE && tableColumn.type === TABLE_DATA_TYPE;
export const isTreeSummaryTableCell: IsSpecificCellFn = (
  tableRow, tableColumn,
) => tableRow.type === TABLE_TREE_SUMMARY_TYPE && tableColumn.type === TABLE_DATA_TYPE;
export const isTotalSummaryTableRow: IsSpecificRowFn = tableRow => (
  tableRow.type === TABLE_TOTAL_SUMMARY_TYPE
);
export const isGroupSummaryTableRow: IsSpecificRowFn = tableRow => (
  tableRow.type === TABLE_GROUP_SUMMARY_TYPE
);
export const isTreeSummaryTableRow: IsSpecificRowFn = tableRow => (
  tableRow.type === TABLE_TREE_SUMMARY_TYPE
);

export const getColumnSummaries: GetColumnSummariesFn = (
  summaryItems, columnName, summaryValues, predicate = () => true,
) => summaryItems
  .map((item, index) => [item, index] as [SummaryItem, number])
  .filter(([item]) => item.columnName === columnName && predicate(item))
  .map(([item, index]) => ({
    type: item.type,
    value: summaryValues[index],
  }));

// TODO: any
const isInlineGroupSummary: PureComputed<[any], boolean> = summaryItem => (
  summaryItem.showInGroupCaption || summaryItem.showInGroupRow
);
const isInlineGroupCaptionSummary: PureComputed<[any], boolean> = summaryItem => (
  summaryItem.showInGroupCaption
);

export const getGroupInlineSummaries: GetGroupInlineSummariesFn = (
  summaryItems, tableColumns, summaryValues,
) => {
  if (!summaryItems.some(isInlineGroupSummary)) {
    return [];
  }

  return tableColumns.reduce((acc, col) => {
    const colName = col.column!.name;
    const summaries = getColumnSummaries(
      summaryItems, colName, summaryValues, isInlineGroupCaptionSummary,
    );
    if (summaries.length) {
      acc.push({
        column: col.column!,
        summaries,
      });
    }

    return acc;
  }, [] as InlineSummary[]);
};
