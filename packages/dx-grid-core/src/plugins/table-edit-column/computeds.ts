import { TABLE_EDIT_COMMAND_TYPE } from './constants';
import { TableColumns } from '../../types';

type ColumnsWithEditingComputed = (
  tableColumns: TableColumns, width: number,
) => TableColumns;

export const tableColumnsWithEditing: ColumnsWithEditingComputed = (tableColumns, width) => [
  { key: TABLE_EDIT_COMMAND_TYPE.toString(), type: TABLE_EDIT_COMMAND_TYPE, width },
  ...tableColumns];
