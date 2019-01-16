import { Rows, RowId, RowIds } from './grid-core.types';

export type IToggleSelection = (
  selection: RowIds,
  payload: { rowIds: RowIds, state: boolean },
) => void;

export type RowsWithSelection = { rows: Rows, availableToSelect: RowId[] };
