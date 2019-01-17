import { GROUP_KEY_SEPARATOR } from '../grouping-state/constants';
import {
  GRID_GROUP_TYPE,
  GRID_GROUP_CHECK,
  GRID_GROUP_LEVEL_KEY,
  GRID_GROUP_COLLAPSED_ROWS,
} from './constants';
import {
  Rows, Groupings, GetCellValueFn, ExpandedGroups, IGroupingCriteria, Row, GetCollapsedRowsFn,
} from '../../types';

export const groupRowChecker = (row: Row) => row[GRID_GROUP_CHECK];

export const groupRowLevelKeyGetter = (row: Row) => (row ? row[GRID_GROUP_LEVEL_KEY] : undefined);

const defaultColumnCriteria = (value: any) => ({
  value,
  key: String(value),
});

export const groupedRows = (
  rows: Rows,
  grouping: Groupings,
  getCellValue: GetCellValueFn,
  getColumnCriteria: (columnName: string) => IGroupingCriteria,
  keyPrefix = '',
) => {
  if (!grouping.length) return rows;

  const { columnName } = grouping[0];
  const groupCriteria = (getColumnCriteria && getColumnCriteria(columnName))
    || defaultColumnCriteria;
  const groups = rows
    .reduce((acc, row) => {
      const { key, value } = groupCriteria(getCellValue(row, columnName), row);
      const sameKeyItems = acc.get(key);

      if (!sameKeyItems) {
        acc.set(key, [value || key, key, [row]]);
      } else {
        sameKeyItems[2].push(row);
      }
      return acc;
    }, new Map());

  const groupedBy = grouping[0].columnName;
  const nestedGrouping = grouping.slice(1);
  return [...groups.values()]
    .reduce((acc, [value, key, items]) => {
      const compoundKey = `${keyPrefix}${key}`;
      acc.push({
        groupedBy,
        compoundKey,
        key,
        value,
        [GRID_GROUP_CHECK]: true,
        [GRID_GROUP_LEVEL_KEY]: `${GRID_GROUP_TYPE.toString()}_${groupedBy}`,
      });
      acc.push(...groupedRows(
        items,
        nestedGrouping,
        getCellValue,
        getColumnCriteria,
        `${compoundKey}${GROUP_KEY_SEPARATOR}`,
      ));
      return acc;
    }, []);
};

type IExpandedGroupRows = (
  rows: Rows,
  grouping: Groupings,
  expandedGroups: ExpandedGroups,
) => Rows;

export const expandedGroupRows: IExpandedGroupRows = (
  rows,
  grouping,
  expandedGroups,
) => {
  if (!grouping.length) return rows;

  const groupingColumnNames = grouping.map(columnGrouping => columnGrouping.columnName);
  const expandedGroupsSet = new Set(expandedGroups);
  let currentGroupExpanded = true;
  let currentGroupLevel = 0;

  return rows.reduce((acc, row) => {
    if (!row[GRID_GROUP_CHECK]) {
      if (currentGroupExpanded) {
        acc.push(row);
      } else {
        acc[acc.length - 1][GRID_GROUP_COLLAPSED_ROWS].push(row);
      }
      return acc;
    }

    const groupLevel = groupingColumnNames.indexOf(row.groupedBy);
    if (groupLevel > currentGroupLevel && !currentGroupExpanded) {
      return acc;
    }

    currentGroupExpanded = expandedGroupsSet.has(row.compoundKey);
    currentGroupLevel = groupLevel;

    if (currentGroupExpanded) {
      acc.push(row);
    } else {
      acc.push({
        ...row,
        [GRID_GROUP_COLLAPSED_ROWS]: [],
      });
    }

    return acc;
  }, []);
};

export const groupCollapsedRowsGetter = (getCollapsedRows: GetCollapsedRowsFn) => (row: Row) => (
  row[GRID_GROUP_COLLAPSED_ROWS] || (getCollapsedRows && getCollapsedRows(row))
);
