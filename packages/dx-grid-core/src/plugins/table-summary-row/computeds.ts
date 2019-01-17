import { PureComputed } from '@devexpress/dx-core';
import {
  TABLE_TOTAL_SUMMARY_TYPE,
  TABLE_GROUP_SUMMARY_TYPE,
  TABLE_TREE_SUMMARY_TYPE,
} from './constants';
import {
  TableRows, GetRowLevelKeyFn, IsSpecificRowFn, GetRowIdFn, Row, TableRow,
} from '../../types';

type RowLevel = { levelKey: number, row: Row, opened: boolean };

export const tableRowsWithTotalSummaries: PureComputed<[TableRows]> = footerRows => [
  { key: TABLE_TOTAL_SUMMARY_TYPE.toString(), type: TABLE_TOTAL_SUMMARY_TYPE },
  ...footerRows,
];

export const tableRowsWithSummaries: PureComputed<
  [TableRows, GetRowLevelKeyFn, IsSpecificRowFn, GetRowIdFn]
> = (
  tableRows, getRowLevelKey, isGroupRow, getRowId,
) => {
  if (!getRowLevelKey) return tableRows;

  const result: TableRow[] = [];
  const closeLevel = (level: RowLevel) => {
    if (!level.opened) return;
    if (isGroupRow && isGroupRow(level.row)) {
      const { compoundKey } = level.row;
      result.push({
        key: `${TABLE_GROUP_SUMMARY_TYPE.toString()}_${compoundKey}`,
        type: TABLE_GROUP_SUMMARY_TYPE,
        row: level.row,
      });
    } else {
      const rowId = getRowId(level.row);
      result.push({
        key: `${TABLE_TREE_SUMMARY_TYPE.toString()}_${rowId}`,
        type: TABLE_TREE_SUMMARY_TYPE,
        row: level.row,
      });
    }
  };

  let levels: any[] = [];
  tableRows.forEach((tableRow) => {
    const { row } = tableRow;
    const levelKey = getRowLevelKey(row);
    if (levelKey) {
      const levelIndex = levels.findIndex(level => level.levelKey === levelKey);
      if (levelIndex > -1) {
        levels.slice(levelIndex).forEach(closeLevel);
        levels = levels.slice(0, levelIndex);
      }
      if (!isGroupRow || !isGroupRow(row)) {
        levels = levels.map(level => ({
          ...level,
          opened: true,
        }));
      }
      levels.push({
        levelKey,
        row,
        opened: false,
      });
    } else {
      levels = levels.map(level => ({
        ...level,
        opened: true,
      }));
    }
    result.push(tableRow);
  });
  levels.slice().reverse().forEach(closeLevel);

  return result;
};
