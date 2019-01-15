import { TABLE_DETAIL_TYPE } from './constants';
import { TABLE_DATA_TYPE } from '../table/constants';
import { IsSpecificCellFn, IsSpecificRowFn, TableColumn, TableColumns } from '../../types';

type IsRowExpandedFn = (expandedDetailRowIds: number[], rowId: number) => boolean;
type IsDetailCellFn = (tableColumn: TableColumn, tableColumns: TableColumns) => boolean;

export const isDetailRowExpanded: IsRowExpandedFn = (
  expandedDetailRowIds, rowId,
) => expandedDetailRowIds.indexOf(rowId) > -1;
export const isDetailToggleTableCell: IsSpecificCellFn = (
  tableRow, tableColumn,
) => tableColumn.type === TABLE_DETAIL_TYPE && tableRow.type === TABLE_DATA_TYPE;
export const isDetailTableRow: IsSpecificRowFn = tableRow => tableRow.type === TABLE_DETAIL_TYPE;
export const isDetailTableCell: IsDetailCellFn = (
  tableColumn, tableColumns,
) => tableColumns.indexOf(tableColumn) === 0;
