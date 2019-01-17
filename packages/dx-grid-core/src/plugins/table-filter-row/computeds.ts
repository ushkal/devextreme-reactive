import { TABLE_FILTER_TYPE } from './constants';
import { TableRows } from '../../types';
import { PureComputed } from '@devexpress/dx-core';

// type RowsWithFilterComputed = (headerRows: TableRows, rowHeight: number) => TableRows;

export const tableHeaderRowsWithFilter: PureComputed<[TableRows, number]> = (
  headerRows, rowHeight,
) => [
  ...headerRows,
  { key: TABLE_FILTER_TYPE.toString(), type: TABLE_FILTER_TYPE, height: rowHeight }];
