import { PureComputed } from '@devexpress/dx-core';
import { TABLE_HEADING_TYPE } from './constants';
import { TABLE_DATA_TYPE } from '../table/constants';
import {
  IsSpecificCellFn, IsSpecificRowFn, TableColumn, TableRow,
  HeaderColumnChainRows, HeaderColumnChainRow, HeaderColumnChain,
  ShouldSplitChainFn, ExtendColumnChainFn,
} from '../../types';

export const isHeadingTableCell: IsSpecificCellFn = (
  tableRow, tableColumn,
) => tableRow.type === TABLE_HEADING_TYPE && tableColumn.type === TABLE_DATA_TYPE;

export const isHeadingTableRow: IsSpecificRowFn = tableRow => (
  tableRow.type === TABLE_HEADING_TYPE
);

export const findChainByColumnIndex: PureComputed<
  [HeaderColumnChainRow, number],
  HeaderColumnChain
> = (chains, columnIndex) => (
  chains.find(chain => (
    chain.start <= columnIndex && columnIndex < chain.start + chain.columns.length
  ))!
);

export const splitHeaderColumnChains: PureComputed<
  [HeaderColumnChainRows, TableColumn[], ShouldSplitChainFn, ExtendColumnChainFn]
> = (
  tableColumnChains, tableColumns, shouldSplitChain, extendChainProps,
) => (
  tableColumnChains.map((row, rowIndex) => row
    .reduce((acc, chain) => {
      let currentChain: any = null;
      chain.columns.forEach((col) => {
        const column = tableColumns.find(c => c.key === col.key);
        const isNewGroup = shouldSplitChain(currentChain, column!, rowIndex);

        if (isNewGroup) {
          const start = currentChain
            ? (currentChain.start + currentChain.columns.length)
            : chain.start;

          acc.push({
            ...chain,
            ...extendChainProps(column!),
            start,
            columns: [],
          });
          currentChain = acc[acc.length - 1];
        }

        currentChain.columns.push(column);
      });

      return acc;
    }, [] as HeaderColumnChain[]))
);

export const generateSimpleChains: PureComputed<
  [TableRow[], TableColumn[]], HeaderColumnChainRows
> = (rows, columns) => (
  rows.map(() => ([{
    start: 0,
    columns,
  }]))
);
