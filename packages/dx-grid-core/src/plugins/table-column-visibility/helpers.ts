import { TABLE_DATA_TYPE } from '../table/constants';
import { TableColumns } from '../../types';

export const tableDataColumnsExist = (tableColumns: TableColumns) => tableColumns.some(
  column => column.type === TABLE_DATA_TYPE,
);
