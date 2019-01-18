import { RowId, Row } from './grid-core.types';

export type ToggleSelectionFn = (
  selection: RowId[],
  payload: { rowIds: RowId[], state: boolean },
) => void;

export type RowsWithSelection = { rows: Row[], availableToSelect: RowId[] };
