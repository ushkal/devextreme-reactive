import { Rows, IGetCellValue, TableRows, Row } from '.';
import { GetRowLevelKeyFn, IsSpecificRowFn, GetCollapsedRowsFn, GetRowIdFn } from './grid-core.types';

export interface SummaryItem {
  /** The name of a column associated with the current summary item. */
  columnName: string;
  /** A summary type. */
  type: SummaryType;
}
export type SummaryType = string;

type GetRowValueFn = (row: Row) => any;
type DefaultSummaryCalulator = (rows: TableRows, getValue: GetRowValueFn) => number | null;
export type DefaultSummaryCalculators = { [key: string]: DefaultSummaryCalulator };
export type SummaryValue = number | null;
export type SummaryCalculator = (
  type: SummaryType, rows: TableRows, getValue: GetRowValueFn,
) => SummaryValue;

type RowsSummaryBaseFn<P3, P4 = never, P5 = never, P6 = never> = (
  rows: TableRows, summaryItems: SummaryItem[], getCellValue: IGetCellValue,
  p3: P3, p4?: P4, p5?: P5, p6?: P6,
) => SummaryValue[];

type SummaryValuesBaseFn<P5, P6 = never> = RowsSummaryBaseFn<
  GetRowLevelKeyFn, IsSpecificRowFn, P5, P6
>;

export type RowsSummaryFn = RowsSummaryBaseFn<SummaryCalculator>;

export type TotalSummaryValuesFn = SummaryValuesBaseFn<GetCollapsedRowsFn, SummaryCalculator>;
export type GroupSummaryValuesFn = SummaryValuesBaseFn<SummaryCalculator>;
export type TreeSummaryValuesFn = SummaryValuesBaseFn<GetRowIdFn, SummaryCalculator>;
