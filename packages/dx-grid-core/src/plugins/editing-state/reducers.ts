import { RowId, RowIds, Rows, Row } from '../../types';

type RowIdsPayload = { rowIds: RowIds; };
type EditRowsReducer = (state: RowIds, payload: RowIdsPayload) => void;

type RowChangePayload = { rowId: RowId, change: any };
type RowChanges = Map<RowId, any>;
type RowChangeReducer = (state: RowChanges, payload: RowChangePayload) => RowChanges;
type AddRowReducer = (state: Rows, payload: { row: Row }) => Rows;

type ChangeAddedRowReducer = (rows: Rows, payload: RowChangePayload) => Rows;
type CancelChangesReducer = (state: RowChanges, payload: RowIdsPayload) => RowChanges;
type DeleteRowsReducer = (state: RowIds, payload: RowIdsPayload) => RowIds;

export const startEditRows: EditRowsReducer = (
  prevEditingRowIds, { rowIds },
) => [...prevEditingRowIds, ...rowIds];

export const stopEditRows: EditRowsReducer = (prevEditingRowIds, { rowIds }) => {
  const rowIdSet = new Set(rowIds);
  return prevEditingRowIds.filter(id => !rowIdSet.has(id));
};

export const addRow: AddRowReducer = (addedRows, { row } = { row: {} }) => [...addedRows, row];

export const changeAddedRow: ChangeAddedRowReducer = (addedRows, { rowId, change }) => {
  const result = addedRows.slice();
  result[rowId] = { ...result[rowId], ...change };
  return result;
};

export const cancelAddedRows: EditRowsReducer = (addedRows, { rowIds }) => {
  const result: any[] = [];
  const indexSet = new Set(rowIds);
  addedRows.forEach((row, index) => {
    if (!indexSet.has(index)) {
      result.push(row);
    }
  });
  return result;
};

export const changeRow: RowChangeReducer = (prevRowChanges, { rowId, change }) => {
  const prevChange = prevRowChanges[rowId] || {};
  return {
    ...prevRowChanges,
    [rowId]: {
      ...prevChange,
      ...change,
    },
  };
};

export const cancelChanges: CancelChangesReducer = (prevRowChanges, { rowIds }) => {
  const result = { ...prevRowChanges };
  rowIds.forEach((rowId) => {
    delete result[rowId];
  });
  return result;
};

export const deleteRows: DeleteRowsReducer = (deletedRowIds, { rowIds }) => [
  ...deletedRowIds, ...rowIds,
];

export const cancelDeletedRows: DeleteRowsReducer = (deletedRowIds, { rowIds }) => {
  const rowIdSet = new Set(rowIds);
  return deletedRowIds.filter(rowId => !rowIdSet.has(rowId));
};
