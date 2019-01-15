import { Computed } from '@devexpress/dx-core';
import { TABLE_SELECT_TYPE } from './constants';
import { TableColumns } from '../../types';

export const tableColumnsWithSelection: Computed<TableColumns, number> = (
  tableColumns, selectionColumnWidth,
) => [
  { key: TABLE_SELECT_TYPE.toString(), type: TABLE_SELECT_TYPE, width: selectionColumnWidth },
  ...tableColumns,
];
