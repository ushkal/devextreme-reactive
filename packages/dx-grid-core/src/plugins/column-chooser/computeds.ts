import { Columns } from '../../types/grid-core.types';

export const columnChooserItems = (
  columns: Columns, hiddenColumnNames: string[],
) => columns.map(column => ({
  column,
  hidden: hiddenColumnNames.indexOf(column.name) !== -1,
}));
