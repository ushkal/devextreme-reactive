import { TABLE_DATA_TYPE } from '../table/constants';
import { TableColumns, TableColumn } from '../../types';

const UNSET_COLUMN_WIDTH_ERROR = [
  'The "$1" column\'s width is not specified.',
  'The TableColumnResizing plugin requires that all columns have the specified width.',
].join('\n');

// tslint:disable-next-line:prefer-array-literal
type Widths = Array<{ columnName: string, width: number }>;
type ISpecifyWidths = (
  tableColumns: TableColumns, widths: Widths, onAbsence: (columnName: string) => void,
) => TableColumns;
type TableColumnsWithWidthComputed = (
  tableColumns: TableColumns, columnWidths: Widths,
) => TableColumns;

const specifyWidths: ISpecifyWidths = (tableColumns, widths, onAbsence) => {
  if (!widths.length) return tableColumns;
  return tableColumns
    .reduce((acc, tableColumn) => {
      if (tableColumn.type === TABLE_DATA_TYPE) {
        const columnName = tableColumn.column!.name;
        const column = widths.find(el => el.columnName === columnName);
        const width = column && column.width;
        if (width === undefined) {
          onAbsence(columnName);
          acc.push(tableColumn);
        } else {
          acc.push({ ...tableColumn, width });
        }
      } else {
        acc.push(tableColumn);
      }
      return acc;
    }, [] as TableColumn[]);
};

export const tableColumnsWithWidths: TableColumnsWithWidthComputed = (
  tableColumns, columnWidths,
) => specifyWidths(tableColumns, columnWidths, (columnName) => {
  throw new Error(UNSET_COLUMN_WIDTH_ERROR.replace('$1', columnName));
});

export const tableColumnsWithDraftWidths: TableColumnsWithWidthComputed = (
  tableColumns, draftColumnWidths,
) => specifyWidths(tableColumns, draftColumnWidths, () => {});
