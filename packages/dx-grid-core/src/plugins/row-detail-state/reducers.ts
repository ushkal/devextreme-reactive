import { StateReducer } from '@devexpress/dx-core';
import { toggle } from '../../utils/common-reducers';

type DetailRowToggleState = number[];
type DetailRowTogglePayload = {
  rowId: number, state: DetailRowToggleState,
};

export const toggleDetailRowExpanded: StateReducer<
  DetailRowToggleState, DetailRowTogglePayload
> = (
  prevExpanded, { rowId, state },
) => toggle(prevExpanded, [rowId], state);
