import { TABLE_DATA_TYPE } from '../table/constants';
import { FIXED_COLUMN_LEFT_SIDE, FIXED_COLUMN_RIGHT_SIDE, TABLE_FIXED_TYPE } from './constants';
import { splitHeaderColumnChains, generateSimpleChains } from '../table-header-row/helpers';
import { Computed } from '@devexpress/dx-core';
import { FixedColumnName, TableColumns, FixedColumnSide, TableRows, HeaderColumnChainRows, ShouldSplitChainFn, TableColumn } from '../../types';

export const tableColumnsWithFixed: Computed<
  TableColumns, FixedColumnName[], FixedColumnName[]
> = (
  tableColumns, leftColumns, rightColumns,
) => tableColumns
  .map((tableColumn) => {
    let fixed: FixedColumnSide;
    if ((tableColumn.type === TABLE_DATA_TYPE
      && leftColumns.indexOf(tableColumn.column!.name) !== -1)
      || leftColumns.indexOf(tableColumn.type) !== -1) {
      fixed = FIXED_COLUMN_LEFT_SIDE;
    }
    if ((tableColumn.type === TABLE_DATA_TYPE
      && rightColumns.indexOf(tableColumn.column!.name) !== -1)
      || rightColumns.indexOf(tableColumn.type) !== -1) {
      fixed = FIXED_COLUMN_RIGHT_SIDE;
    }
    return fixed ? { ...tableColumn, fixed } : tableColumn;
  });

export const tableHeaderRowsWithFixed: Computed<TableRows> = tableHeaderRows => [
  ...tableHeaderRows,
  { key: TABLE_FIXED_TYPE.toString(), type: TABLE_FIXED_TYPE, height: 0 },
];

export const tableHeaderColumnChainsWithFixed: Computed<
  HeaderColumnChainRows, TableRows, TableColumns
> = (
  tableHeaderColumnChains, tableHeaderRows, tableColumns,
) => {
  const chains = tableHeaderColumnChains
    || generateSimpleChains(tableHeaderRows, tableColumns);

  const shouldSplitChain: ShouldSplitChainFn = (currentGroup, column) => (
    !currentGroup || (currentGroup as any).fixed !== column.fixed
  );
  const extendChainProps = (column: TableColumn) => ({
    fixed: column.fixed,
  });
  return splitHeaderColumnChains(
    chains,
    tableColumns,
    shouldSplitChain,
    extendChainProps,
  );
};
