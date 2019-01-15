import { RowId } from '../../types';

export const getRowChange = (rowChanges: any, rowId: RowId) => rowChanges[rowId] || {};
