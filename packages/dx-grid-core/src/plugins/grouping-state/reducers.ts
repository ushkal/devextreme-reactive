import { GROUP_KEY_SEPARATOR } from './constants';
import { Grouping, Groupings } from '../../types/grouping.types';
import { Getters } from '@devexpress/dx-react-core';

type ChangeGroupingPayload = { columnName: string, groupIndex: number };
type ColumnGroupingState = { grouping: Groupings, expandedGroups: ReadonlyArray<string> };

const applyColumnGrouping = (
  grouping: ReadonlyArray<Grouping>,
  { columnName, groupIndex }: ChangeGroupingPayload,
) => {
  const nextGrouping = grouping.slice();
  const groupingIndex = nextGrouping.findIndex(g => g.columnName === columnName);
  let targetIndex = groupIndex;

  if (groupingIndex > -1) {
    nextGrouping.splice(groupingIndex, 1);
  } else if (groupIndex === undefined) {
    targetIndex = nextGrouping.length;
  }

  if (targetIndex > -1) {
    nextGrouping.splice(targetIndex, 0, {
      columnName,
    });
  }

  return nextGrouping;
};

export const changeColumnGrouping = (
  { grouping, expandedGroups }: ColumnGroupingState,
  { columnName, groupIndex }: ChangeGroupingPayload,
) => {
  const nextGrouping = applyColumnGrouping(grouping, { columnName, groupIndex });

  const ungroupedColumnIndex = grouping.findIndex(
    (group, index) => !nextGrouping[index] || group.columnName !== nextGrouping[index].columnName,
  );
  if (ungroupedColumnIndex === -1) {
    return {
      grouping: nextGrouping,
    };
  }

  const filteredExpandedGroups = expandedGroups.filter(
    group => group.split(GROUP_KEY_SEPARATOR).length <= ungroupedColumnIndex,
  );
  if (filteredExpandedGroups.length === expandedGroups.length) {
    return {
      grouping: nextGrouping,
    };
  }

  return {
    grouping: nextGrouping,
    expandedGroups: filteredExpandedGroups,
  };
};

export const toggleExpandedGroups = (
  state: ColumnGroupingState,
  { groupKey }: { groupKey: string },
) => {
  const expandedGroups = state.expandedGroups.slice();
  const groupKeyIndex = expandedGroups.indexOf(groupKey);

  if (groupKeyIndex > -1) {
    expandedGroups.splice(groupKeyIndex, 1);
  } else {
    expandedGroups.push(groupKey);
  }

  return {
    expandedGroups,
  };
};

export const draftColumnGrouping = (
  { grouping, draftGrouping }: Getters,
  { columnName, groupIndex }: ChangeGroupingPayload,
) => ({
  draftGrouping: applyColumnGrouping(draftGrouping || grouping, { columnName, groupIndex }),
});

export const cancelColumnGroupingDraft = () => ({
  draftGrouping: null,
});
