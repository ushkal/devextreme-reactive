import mergeSort from '../../utils/merge-sort';
import { NODE_CHECK, rowsToTree, treeToRows, TreeNode } from '../../utils/hierarchical-data';
import {
  Sortings, Row, Rows, GetCellValueFn, GetRowLevelKeyFn, IsSpecificRowFn, CompareFn,
} from '../../types';

const defaultCompare = (a: any, b: any) => {
  if (a === b) return 0;

  if (a === null) {
    return b === undefined ? -1 : 1;
  }
  if (a === undefined) {
    return 1;
  }
  if (b === null || b === undefined) {
    return -1;
  }
  return a < b ? -1 : 1;
};

type IGetColumnCompare = (name: string) => (a: any, b: any) => number;

const createCompare: (...args: any[]) => CompareFn = (
  sorting: Sortings,
  getColumnCompare: IGetColumnCompare,
  getComparableValue: (row: Row, columnName: string) => any,
) => sorting.slice()
  .reverse()
  .reduce(
    (prevCompare, columnSorting) => {
      const { columnName } = columnSorting;
      const inverse = columnSorting.direction === 'desc';
      const columnCompare = (getColumnCompare && getColumnCompare(columnName)) || defaultCompare;

      return (aRow: Row, bRow: Row) => {
        const a = getComparableValue(aRow, columnName);
        const b = getComparableValue(bRow, columnName);
        const result = columnCompare(a, b);

        if (result !== 0) {
          return inverse ? -result : result;
        }
        return prevCompare(aRow, bRow);
      };
    },
    (...args: any[]) => 0,
  );

type ISortTree = (tree: TreeNode[], compare: CompareFn) => TreeNode[];
const sortTree: ISortTree = (tree, compare) => {
  const sortedTree = tree.map((node) => {
    if (node[NODE_CHECK]) {
      return {
        ...node,
        children: sortTree(node.children, compare),
      };
    }
    return node;
  });

  return mergeSort(
    sortedTree, (a, b) => compare(a[NODE_CHECK] ? a.root : a, b[NODE_CHECK] ? b.root : b),
  ) as TreeNode[];
};

const sortHierarchicalRows = (rows: Rows, compare: CompareFn, getRowLevelKey: GetRowLevelKeyFn) => {
  const tree = rowsToTree(rows, getRowLevelKey);

  const sortedTree = sortTree(tree, compare);

  return treeToRows(sortedTree);
};

export const sortedRows = (
  rows: Rows,
  sorting: Sortings,
  getCellValue: GetCellValueFn,
  getColumnCompare: IGetColumnCompare,
  isGroupRow: IsSpecificRowFn,
  getRowLevelKey: GetRowLevelKeyFn,
) => {
  if (!sorting.length || !rows.length) return rows;

  let compare;
  if (!getRowLevelKey) {
    compare = createCompare(sorting, getColumnCompare, getCellValue);
    return mergeSort(rows.slice(), compare);
  }

  compare = createCompare(sorting, getColumnCompare, (row: Row, columnName: string) => {
    if (isGroupRow && isGroupRow(row)) {
      if (row.groupedBy === columnName) {
        return row.value;
      }
      return undefined;
    }
    return getCellValue(row, columnName);
  });
  return sortHierarchicalRows(
    rows,
    compare,
    getRowLevelKey,
  );
};
