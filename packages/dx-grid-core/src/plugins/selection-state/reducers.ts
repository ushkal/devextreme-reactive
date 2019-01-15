import { toggle } from '../../utils/common-reducers';
import { IToggleSelection } from '../../types';

export const toggleSelection: IToggleSelection = (
  selection, { rowIds, state },
) => toggle(selection, rowIds, state as any);
