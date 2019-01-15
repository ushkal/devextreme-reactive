import { TableColumns, TableColumn } from './table.types';

export type HeaderColumnChain = { start: number, columns: TableColumns };
export type HeaderColumnChainRow = ReadonlyArray<HeaderColumnChain>;
export type HeaderColumnChainRows = ReadonlyArray<HeaderColumnChainRow>;

export type ShouldSplitChainFn = (
  chain: HeaderColumnChain, column: TableColumn, rowIndex: number,
) => boolean;

export type GetHeaderColumnChainsFn<P0, P1 = any, P2 = any> = (
  p0: P0, p1: P1, p2: P2,
) => HeaderColumnChainRows;
