import { Rows, GetRowIdFn, IsSpecificRowFn, RowsWithSelection, RowIds } from '../../types';

type IGetRowsWithSelection = (
  rows: Rows,
  getRowsId: GetRowIdFn,
  isGroupRow: IsSpecificRowFn,
) => RowsWithSelection;

export const rowsWithAvailableToSelect: IGetRowsWithSelection = (
  rows, getRowId, isGroupRow,
) => {
  let dataRows = rows;
  if (isGroupRow) {
    dataRows = dataRows.filter(row => !isGroupRow(row));
  }
  return { rows, availableToSelect: dataRows.map(row => getRowId(row)) };
};

type IRowsSelected = (
  rows: RowsWithSelection,
  selection: RowIds,
) => boolean;
export const someSelected: IRowsSelected = ({ availableToSelect }, selection) => {
  const selectionSet = new Set(selection);

  return availableToSelect.length !== 0 && selectionSet.size !== 0
    && availableToSelect.some(elem => selectionSet.has(elem))
    && availableToSelect.some(elem => !selectionSet.has(elem));
};

export const allSelected: IRowsSelected = ({ availableToSelect }, selection) => {
  const selectionSet = new Set(selection);

  return selectionSet.size !== 0 && availableToSelect.length !== 0
    && !availableToSelect.some(elem => !selectionSet.has(elem));
};

export const unwrapSelectedRows = ({ rows }: RowsWithSelection) => rows;
