import { TABLE_FILTER_TYPE, DEFAULT_FILTER_OPERATIONS } from './constants';
import { TABLE_DATA_TYPE } from '../table/constants';
import {
  IsSpecificCellFn, IsSpecificRowFn, FilterOperation, Filter, GetAvailableFilterOperationsFn,
} from '../../types';

type GetFilterOperationsFn = (
  getAvailableFilterOperations: GetAvailableFilterOperationsFn,
  columnName: string,
) => FilterOperation[];
type GetSelectedFilterOperationFn = (
  filterOperations: FilterOperation[], columnName: string,
  columnFilter: Filter, columnFilterOperations: FilterOperation[],
) => FilterOperation;

export const isFilterTableCell: IsSpecificCellFn = (
  tableRow, tableColumn,
) => tableRow.type === TABLE_FILTER_TYPE && tableColumn.type === TABLE_DATA_TYPE;

export const isFilterTableRow: IsSpecificRowFn = tableRow => tableRow.type === TABLE_FILTER_TYPE;

export const getColumnFilterOperations: GetFilterOperationsFn = (
  getAvailableFilterOperations, columnName,
) => (getAvailableFilterOperations && getAvailableFilterOperations(columnName))
  || DEFAULT_FILTER_OPERATIONS;

export const isFilterValueEmpty = (value: any) => value === undefined || !String(value).length;

export const getSelectedFilterOperation: GetSelectedFilterOperationFn = (
  filterOperations, columnName, columnFilter, columnFilterOperations,
) => {
  if (filterOperations[columnName]) {
    return filterOperations[columnName];
  }
  return columnFilter && columnFilter.operation
    ? columnFilter.operation
    : columnFilterOperations[0];
};
