/** Describes a filter. */
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

export type FilterPredicate = (value: any, filter: Filter, row: any) => boolean;
export type FilterPredicates = ReadonlyArray<FilterPredicate>;

export type Filters = ReadonlyArray<Filter>;
