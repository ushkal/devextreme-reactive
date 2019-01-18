import {
  GetRowLevelKeyFn, IsSpecificRowFn, GetCollapsedRowsFn, GetRowIdFn, Row, GetCellValueFn,
} from './grid-core.types';
import { TableRows, TableRow } from './table.types';
import { PureComputed } from '@devexpress/dx-core';

export interface SummaryItem {
  /** The name of a column associated with the current summary item. */
  columnName: string;
  /** A summary type. */
  type: SummaryType;
}
export type SummaryType = string;

type GetRowValueFn = (row: Row) => any;
export type GetColumnSummariesFn = PureComputed<
  [SummaryItem[], string, SummaryValue[]],
  // tslint:disable-next-line: prefer-array-literal
  Array<{ type: SummaryType, value: SummaryValue }>
>;

type DefaultSummaryCalulator = PureComputed<[Row[], GetRowValueFn], SummaryValue>;
export type DefaultSummaryCalculators = { [key: string]: DefaultSummaryCalulator };
export type SummaryValue = number | null;
type GroupSummaryValue = { [key: string]: SummaryValue[] };
type TreeSummaryValue = { [key: number]: SummaryValue[] };

export type SummaryCalculator = PureComputed<
  [SummaryType, Row[], GetRowValueFn], SummaryValue
>;

export type RowsSummaryValuesFn = PureComputed<
  [TableRows, SummaryItem[], GetCellValueFn, SummaryCalculator], SummaryValue[]
>;

export type TotalSummaryValuesFn = PureComputed<[
  TableRows, SummaryItem[], GetCellValueFn, GetRowLevelKeyFn,
  IsSpecificRowFn, GetCollapsedRowsFn, SummaryCalculator
], SummaryValue[]>;

export type GroupSummaryValuesFn = PureComputed<[
  TableRows, SummaryItem[], GetCellValueFn, GetRowLevelKeyFn,
  IsSpecificRowFn, SummaryCalculator
], GroupSummaryValue>;

export type TreeSummaryValuesFn = PureComputed<[
  TableRows, SummaryItem[], GetCellValueFn, GetRowLevelKeyFn,
  IsSpecificRowFn, GetRowIdFn, SummaryCalculator
], TreeSummaryValue>;
