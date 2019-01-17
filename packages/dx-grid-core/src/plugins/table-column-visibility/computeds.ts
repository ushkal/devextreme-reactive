import { PureComputed } from '@devexpress/dx-core';
import { TABLE_DATA_TYPE } from '../table/constants';
import { TableColumns } from '../../types';

export const visibleTableColumns: PureComputed<[TableColumns, string[]]> = (
  tableColumns, hiddenColumnNames,
) => tableColumns.filter(tableColumn => tableColumn.type !== TABLE_DATA_TYPE
    || hiddenColumnNames.indexOf(tableColumn.column!.name) === -1);
