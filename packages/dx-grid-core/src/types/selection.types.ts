import { Rows, RowId } from './grid-core.types';

export type RowsSelection = ReadonlyArray<number | string>;
export type ToggleSelectionPayload = { rowIds: ReadonlyArray<number>, state: Readonly<boolean> };
export type IToggleSelection = (
  selection: RowsSelection,
  payload: { rowIds: ReadonlyArray<number>, state: boolean },
) => void;

export type RowsWithSelection = { rows: Rows, availableToSelect: RowId[] };
