import { TableColumns, TableColumn } from './table.types';
import { PureComputed } from '@devexpress/dx-core';

export type HeaderColumnChain = { start: number, columns: TableColumns };
export type HeaderColumnChainRow = ReadonlyArray<HeaderColumnChain>;
export type HeaderColumnChainRows = ReadonlyArray<HeaderColumnChainRow>;

export type ShouldSplitChainFn = PureComputed<
  [HeaderColumnChain, TableColumn, number],
  boolean
>;

export type GetHeaderColumnChainsFn<P0, P1 = any, P2 = any> = PureComputed<
  [P0, P1, P2],
  HeaderColumnChainRows
>;
