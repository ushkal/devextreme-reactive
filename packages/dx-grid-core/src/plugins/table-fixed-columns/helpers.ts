import { TABLE_DATA_TYPE } from '../table/constants';
import {
  FIXED_COLUMN_LEFT_SIDE, TABLE_FIXED_TYPE,
} from './constants';
import { findChainByColumnIndex } from '../table-header-row/helpers';
import { TableColumns, FixedColumnName, IsSpecificRowFn, TableColumn, HeaderColumnChainRows, FixedColumnSide } from '../../types';

type ColumnDimensions = { [key: string]: number };
type GetFixedColumnKeysFn = (tableColumns: TableColumns, fiexdNames: FixedColumnName[]) => string[];

type CalculatePositionFn = (array: string[], index: number, dimensions: ColumnDimensions) => number;
type CalculateFixedColumnPropsFn = (
  params: { tableColumn: TableColumn },
  fixedNames: { leftColumns: FixedColumnName[], rightColumns: FixedColumnName[] },
  tableColumns: TableColumns,
  tableColumnDimensions: ColumnDimensions,
  tableHeaderColumnChains: HeaderColumnChainRows,
) => {
  showRightDivider: boolean,
  showLeftDivider: boolean,
  position: number,
  side: FixedColumnSide,
};

export const getFixedColumnKeys: GetFixedColumnKeysFn = (tableColumns, fixedNames) => tableColumns
  .filter(tableColumn => (
    (tableColumn.type === TABLE_DATA_TYPE && fixedNames.indexOf(tableColumn.column!.name) !== -1)
    || fixedNames.indexOf(tableColumn.type) !== -1
  ))
  .map(({ key }) => key);

export const isFixedTableRow: IsSpecificRowFn = tableRow => tableRow.type === TABLE_FIXED_TYPE;

const calculatePosition: CalculatePositionFn = (array, index, tableColumnDimensions) => (
  index === 0
    ? 0
    : array
      .slice(0, index)
      .reduce((acc, target) => acc + tableColumnDimensions[target] || 0, 0)
);

export const calculateFixedColumnProps: CalculateFixedColumnPropsFn = (
  { tableColumn },
  { leftColumns, rightColumns },
  tableColumns,
  tableColumnDimensions,
  tableHeaderColumnChains,
) => {
  const { fixed: side } = tableColumn;
  const targetArray = side === FIXED_COLUMN_LEFT_SIDE
    ? getFixedColumnKeys(tableColumns, leftColumns)
    : getFixedColumnKeys(tableColumns, rightColumns).reverse();

  const index = tableColumns.findIndex(({ key }) => key === tableColumn.key);
  const fixedIndex = targetArray.indexOf(tableColumn.key);
  const columnChain = findChainByColumnIndex(tableHeaderColumnChains[0], index)!;

  const showLeftDivider = columnChain.start === index && index !== 0;
  const showRightDivider = columnChain.start + columnChain.columns.length - 1 === index
    && index < tableColumns.length - 1;

  const position = calculatePosition(targetArray, fixedIndex, tableColumnDimensions);

  return {
    showRightDivider,
    showLeftDivider,
    position,
    side,
  };
};
