import { GROUP_KEY_SEPARATOR } from '../grouping-state/constants';
import { Grouping, GetChildGroups } from '../../types/grouping.types';
import {
  GRID_GROUP_TYPE,
  GRID_GROUP_CHECK,
  GRID_GROUP_LEVEL_KEY,
} from '../integrated-grouping/constants';
import { GetRowIdFn, Rows, Row } from '../../types/grid-core.types';

export const customGroupedRows = (
  currentRows: any[],
  grouping: Grouping[],
  getChildGroups: GetChildGroups,
  rootRows = currentRows,
  keyPrefix = '',
) => {
  if (!currentRows || !currentRows.length) return [];
  if (!grouping.length) return currentRows;

  const groupedBy = grouping[0].columnName;
  const nestedGrouping = grouping.slice(1);
  return getChildGroups(currentRows, grouping[0], rootRows)
    .reduce((acc, { key, value = key, childRows }) => {
      const compoundKey = `${keyPrefix}${key}`;
      acc.push({
        groupedBy,
        compoundKey,
        key,
        value,
        [GRID_GROUP_CHECK]: true,
        [GRID_GROUP_LEVEL_KEY]: `${GRID_GROUP_TYPE.toString()}_${groupedBy}`,
      });
      acc.push(...customGroupedRows(
        childRows!,
        nestedGrouping,
        getChildGroups,
        rootRows,
        `${compoundKey}${GROUP_KEY_SEPARATOR}`,
      ));
      return acc;
    }, [] as any[]);
};

export const customGroupingRowIdGetter = (getRowId: GetRowIdFn, rows: Rows) => {
  const firstRow = rows.find(row => !row[GRID_GROUP_CHECK]);
  if (!firstRow || getRowId(firstRow) !== undefined) {
    return getRowId;
  }

  const map: Map<any, any> = new Map(rows
    .filter(row => !row[GRID_GROUP_CHECK])
    .map((row, rowIndex) => [row, rowIndex]) as [any, any]);

  return (row: Row) => map.get(row);
};
