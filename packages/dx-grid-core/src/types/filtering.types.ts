/** Describes a filter. */
import { PureComputed } from '@devexpress/dx-core';
import { Row } from './grid-core.types';
export interface Filter {
  /** Specifies the name of a column whose value is used for filtering. */
  columnName: string;
  /** Specifies the operation name. The value is 'contains' if the operation name is not set. */
  operation?: FilterOperation;
  /** Specifies the filter value. */
  value?: string;
}

/** Describes data filtering expressions */
export interface FilterExpression {
  /** Specifies the Boolean operator */
  operator: 'and' | 'or';
  /** Specifies filters or filter expressions */
  // tslint:disable-next-line:prefer-array-literal
  filters: Array<FilterExpression | Filter>;
}

/*** Describes a filter operation. Accepts one of the built-in operations or a custom string.
 * Built-in operations: `contains`, `notContains`, `startsWith`, `endsWith`, `equal`, `notEqual`,
 * `greaterThan`, `graterThenOrEqual`, `lessThan`, `lessThanOrEqual` */
export type FilterOperation = string;
export type GetAvailableFilterOperationsFn = (columnName: string) => FilterOperation[] | undefined;

export type FilterPredicate = PureComputed<[any, Filter, Row?], boolean>;

export type ChangeFilterPayload = { columnName: string, config: object };
