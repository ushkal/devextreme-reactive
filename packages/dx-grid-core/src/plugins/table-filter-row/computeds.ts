import { TABLE_FILTER_TYPE } from './constants';
import { TableRows } from '../../types';
import { Computed } from '@devexpress/dx-core';

// type RowsWithFilterComputed = (headerRows: TableRows, rowHeight: number) => TableRows;

export const tableHeaderRowsWithFilter: Computed<TableRows, number> = (headerRows, rowHeight) => [
  ...headerRows,
  { key: TABLE_FILTER_TYPE.toString(), type: TABLE_FILTER_TYPE, height: rowHeight }];
