import { TABLE_DATA_TYPE, TABLE_NODATA_TYPE } from './constants';
import {
  IsSpecificCellFn, IsSpecificRowFn, TableRow, TableRows, TableColumns, TableColumn,
} from '../../types';

export const isDataTableCell: IsSpecificCellFn = (
  tableRow, tableColumn,
) => tableRow.type === TABLE_DATA_TYPE && tableColumn.type === TABLE_DATA_TYPE;
export const isHeaderStubTableCell: IsSpecificCellFn<TableRow, TableRows> = (
  tableRow, headerRows,
) => headerRows.indexOf(tableRow) > -1;
export const isDataTableRow: IsSpecificRowFn = tableRow => tableRow.type === TABLE_DATA_TYPE;
export const isNoDataTableRow: IsSpecificRowFn = tableRow => tableRow.type === TABLE_NODATA_TYPE;
export const isNoDataTableCell: IsSpecificCellFn<TableColumn, TableColumns> = (
  tableColumn, tableColumns,
) => tableColumns.indexOf(tableColumn as any) === 0;
