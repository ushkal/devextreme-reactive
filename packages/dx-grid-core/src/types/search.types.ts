import { Columns } from "./grid-core.types";
import { FilterExpression } from "./filtering.types";

export type SearchFilterExpressionFn = (
  searchValue: string, columns: Columns, filterExpression: FilterExpression,
) => FilterExpression;
