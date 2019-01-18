import { PureComputed } from '@devexpress/dx-core';
import { Grouping, Column, GroupingPanelItem } from '../../types/';

export const groupingPanelItems: PureComputed<
  [Column[], Grouping[], Grouping[]], GroupingPanelItem[]
> = (
  columns, grouping, draftGrouping,
) => {
  const items = draftGrouping.map(({ columnName }) => ({
    column: columns.find(c => c.name === columnName)!,
    draft: !grouping.some(columnGrouping => columnGrouping.columnName === columnName),
  }));

  grouping.forEach(({ columnName }, index) => {
    if (draftGrouping.some(columnGrouping => columnGrouping.columnName === columnName)) return;
    items.splice(index, 0, {
      column: columns.find(c => c.name === columnName)!,
      draft: true,
    });
  });

  return items;
};
