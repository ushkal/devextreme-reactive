import { GRID_GROUP_CHECK } from '../integrated-grouping/constants';
import { IGetRowId, Row, Rows, Columns } from '../../types';

const warnIfRowIdUndefined = (getRowId: IGetRowId) => (row: Row) => {
  const result = getRowId(row);
  if (!row[GRID_GROUP_CHECK] && result === undefined) {
    // tslint:disable-next-line: no-console
    console.warn('The row id is undefined. Check the getRowId function. The row is', row);
  }
  return result;
};

export const rowIdGetter = (getRowId: IGetRowId, rows: Rows) => {
  if (!getRowId) {
    const map = new Map(rows.map((row, rowIndex) => [row, rowIndex]) as [any, any]);
    return (row: Row) => map.get(row);
  }
  return warnIfRowIdUndefined(getRowId);
};

const defaultGetCellValue = (row: Row, columnName: string) => row[columnName];
export const cellValueGetter = (getCellValue = defaultGetCellValue, columns: Columns) => {
  let useFastAccessor = true;
  const map = columns.reduce((acc, column) => {
    if (column.getCellValue) {
      useFastAccessor = false;
      acc[column.name] = column.getCellValue;
    }
    return acc;
  }, {});

  if (useFastAccessor) {
    return getCellValue;
  }

  return (row: Row, columnName: string) => (map[columnName]
    ? map[columnName](row, columnName)
    : getCellValue(row, columnName));
};
