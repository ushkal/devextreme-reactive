import {
  GetRowLevelKeyFn, IsSpecificRowFn, GetCollapsedRowsFn, GetRowIdFn, Row, GetCellValueFn,
} from './grid-core.types';
import { TableRows } from './table.types';

export interface SummaryItem {
  /** The name of a column associated with the current summary item. */
  columnName: string;
  /** A summary type. */
  type: SummaryType;
}
export type SummaryType = string;

type GetRowValueFn = (row: Row) => any;
export type GetColumnSummariesFn = (...args: [
  SummaryItem[], string, SummaryValue[]
// tslint:disable-next-line:prefer-array-literal
]) => Array<{ type: SummaryType, value: SummaryValue }>;

type DefaultSummaryCalulator = (rows: TableRows, getValue: GetRowValueFn) => number | null;
export type DefaultSummaryCalculators = { [key: string]: DefaultSummaryCalulator };
export type SummaryValue = number | null;
type GroupSummaryValue = { [key: string]: SummaryValue[] };
type TreeSummaryValue = { [key: number]: SummaryValue[] };

export type SummaryCalculator = (...args: [SummaryType, TableRows, GetRowValueFn]) => SummaryValue;

export type RowsSummaryFn = (...args: [
  TableRows, SummaryItem[], GetCellValueFn, SummaryCalculator
]) => SummaryValue[];

export type TotalSummaryValuesFn = (...args: [
  TableRows, SummaryItem[], GetCellValueFn, GetRowLevelKeyFn,
  IsSpecificRowFn, GetCollapsedRowsFn, SummaryCalculator
]) => SummaryValue[];

export type GroupSummaryValuesFn = (...args: [
  TableRows, SummaryItem[], GetCellValueFn, GetRowLevelKeyFn,
  IsSpecificRowFn, SummaryCalculator
]) => GroupSummaryValue;

export type TreeSummaryValuesFn = (...args: [
  TableRows, SummaryItem[], GetCellValueFn, GetRowLevelKeyFn,
  IsSpecificRowFn, GetRowIdFn, SummaryCalculator
]) => TreeSummaryValue;
