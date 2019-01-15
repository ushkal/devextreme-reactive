import { RowIds, Rows, Row } from '../../types';
import { EditingColumnExtension } from '../../types/editing.types';

export const changedRowsByIds = (changes: any, rowIds: RowIds) => {
  const result = {};
  rowIds.forEach((rowId) => {
    result[rowId] = changes[rowId];
  });
  return result;
};

export const addedRowsByIds = (addedRows: Rows, rowIds: RowIds) => {
  const rowIdSet = new Set(rowIds);
  const result: any = [];
  addedRows.forEach((row, index) => {
    if (rowIdSet.has(index)) {
      result.push(row);
    }
  });
  return result;
};

type ICreateRowChange = (row: Row, value: any, columnName: string) => any;
type CreateRowChangeGetter = (
  createRowChange: ICreateRowChange, columnExtensions: EditingColumnExtension[],
) => ICreateRowChange;

const defaultCreateRowChange: ICreateRowChange = (row, value, columnName) => (
  { [columnName]: value }
);
export const createRowChangeGetter: CreateRowChangeGetter = (
  createRowChange = defaultCreateRowChange,
  columnExtensions: any[] = [],
) => {
  const map = columnExtensions.reduce((acc, columnExtension) => {
    if (columnExtension.createRowChange) {
      acc[columnExtension.columnName] = columnExtension.createRowChange;
    }
    return acc;
  }, {});

  return (row, value, columnName) => {
    if (map[columnName]) {
      return map[columnName](row, value, columnName);
    }
    return createRowChange(row, value, columnName);
  };
};
