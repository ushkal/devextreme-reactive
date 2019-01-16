import { NODE_CHECK, rowsToTree, treeToRows } from '../../utils/hierarchical-data';
import {
  Row, Filter, Rows, FilterPredicate, GetRowLevelKeyFn,
  FilterExpression, IGetCellValue, GetCollapsedRowsFn,
} from '../../types';

type IGetColumnPredicate = (columnName: string) => FilterPredicate;
type ICompiledPredicate = (row: any, ...args: any[]) => boolean;

const operators = {
  or: (predicates: ICompiledPredicate[]) => (row: Row) => (
    predicates.reduce((acc, predicate) => acc || predicate(row), false)
  ),
  and: (predicates: ICompiledPredicate[]) => (row: Row) => (
    predicates.reduce((acc, predicate) => acc && predicate(row), true)
  ),
};

const toLowerCase = (value: any) => String(value).toLowerCase();

const operationPredicates = {
  contains: (value: any, filter: Filter) => toLowerCase(value)
    .indexOf(toLowerCase(filter.value)) > -1,

  notContains: (value: any, filter: Filter) => toLowerCase(value)
    .indexOf(toLowerCase(filter.value)) === -1,

  startsWith: (value: any, filter: Filter) => toLowerCase(value)
    .startsWith(toLowerCase(filter.value)),

  endsWith: (value: any, filter: Filter) => toLowerCase(value)
    .endsWith(toLowerCase(filter.value)),

  equal: (value: any, filter: Filter) => value === filter.value,
  notEqual: (value: any, filter: Filter) => value !== filter.value,
  greaterThan: (value: any, filter: Filter) => value > filter.value!,
  greaterThanOrEqual: (value: any, filter: Filter) => value >= filter.value!,
  lessThan: (value: any, filter: Filter) => value < filter.value!,
  lessThanOrEqual: (value: any, filter: Filter) => value <= filter.value!,
};

export const defaultFilterPredicate = (value: any, filter: Filter) => {
  const operation = filter.operation || 'contains';
  return operationPredicates[operation](value, filter);
};

const filterTree = (tree: any[], predicate: ICompiledPredicate) => tree.reduce(
  (acc, node) => {
    if (node[NODE_CHECK]) {
      const filteredChildren = filterTree(node.children, predicate);
      if (filteredChildren.length > 0) {
        acc.push({
          ...node,
          children: filteredChildren,
        });
        return acc;
      }
      if (predicate(node.root, true)) {
        acc.push(node.root);
        return acc;
      }
      return acc;
    }

    if (predicate(node)) {
      acc.push(node);
      return acc;
    }

    return acc;
  },
  [],
);

const filterHierarchicalRows = (
  rows: Rows,
  predicate: ICompiledPredicate,
  getRowLevelKey: GetRowLevelKeyFn,
  getCollapsedRows: GetCollapsedRowsFn,
) => {
  const tree = rowsToTree(rows, getRowLevelKey);
  const collapsedRowsMeta: any[] = [];

  const filteredTree = filterTree(tree, (row, isNode) => {
    if (isNode) {
      const collapsedRows = getCollapsedRows && getCollapsedRows(row);
      if (collapsedRows && collapsedRows.length) {
        const filteredCollapsedRows = collapsedRows.filter(predicate);
        collapsedRowsMeta.push([row, filteredCollapsedRows]);
        return !!filteredCollapsedRows.length || predicate(row);
      }
      if (predicate(row)) {
        collapsedRowsMeta.push([row, []]);
        return true;
      }
      return false;
    }
    return predicate(row);
  });

  return { rows: treeToRows(filteredTree), collapsedRowsMeta: new Map(collapsedRowsMeta) };
};

const buildPredicate = (
  initialFilterExpression: FilterExpression,
  getCellValue: IGetCellValue,
  getColumnPredicate: IGetColumnPredicate,
) => {
  const getSimplePredicate = (filter: Filter) => {
    const { columnName } = filter;
    const customPredicate = getColumnPredicate && getColumnPredicate(columnName);
    const predicate = customPredicate || defaultFilterPredicate;
    return (row: Row) => predicate(getCellValue(row, columnName), filter, row);
  };

  const getOperatorPredicate: any = (filterExpression: FilterExpression) => {
    const build = operators[toLowerCase(filterExpression.operator)];
    // eslint-disable-next-line no-use-before-define
    return build && build(filterExpression.filters.map(getPredicate));
  };

  const getPredicate = (filterExpression: any) => (
    getOperatorPredicate(filterExpression)
    || getSimplePredicate(filterExpression)
  );

  return getPredicate(initialFilterExpression);
};

export const filteredRows = (
  rows: Rows,
  filterExpression: FilterExpression,
  getCellValue: IGetCellValue,
  getColumnPredicate: IGetColumnPredicate,
  getRowLevelKey: GetRowLevelKeyFn,
  getCollapsedRows: GetCollapsedRowsFn,
) => {
  if (!(filterExpression && Object.keys(filterExpression).length && rows.length)) {
    return { rows };
  }

  const predicate = buildPredicate(
    filterExpression,
    getCellValue,
    getColumnPredicate,
  );

  return getRowLevelKey
    ? filterHierarchicalRows(rows, predicate, getRowLevelKey, getCollapsedRows)
    : { rows: rows.filter(predicate) };
};

export const filteredCollapsedRowsGetter = (
  { collapsedRowsMeta }: { collapsedRowsMeta: Map<any, any> },
) => (row: Row) => collapsedRowsMeta && collapsedRowsMeta.get(row);

export const unwrappedFilteredRows = ({ rows }: { rows: Rows }) => rows;
