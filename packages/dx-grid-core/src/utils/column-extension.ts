import { ColumnExtension } from '../types';

type GetColumnExtensionFn = (...args: [ColumnExtension[], string]) => ColumnExtension;
type GetColumnExtensionValueGetterFn = (...args: [
  ColumnExtension[], string, any
]) => (columnName: string) => any;

export const getColumnExtension: GetColumnExtensionFn = (columnExtensions, columnName) => {
  if (!columnExtensions) {
    // tslint:disable-next-line:no-object-literal-type-assertion
    return {} as ColumnExtension;
  }
  const columnExtension = columnExtensions.find(extension => extension.columnName === columnName);
  if (!columnExtension) {
    // tslint:disable-next-line:no-object-literal-type-assertion
    return {} as ColumnExtension;
  }
  return columnExtension;
};

export const getColumnExtensionValueGetter: GetColumnExtensionValueGetterFn = (
  columnExtensions, extensionName, defaultValue,
) => (columnName) => {
  if (columnExtensions) {
    const columnExtension = getColumnExtension(columnExtensions, columnName);
    const extensionValue = columnExtension[extensionName];
    return extensionValue !== undefined ? extensionValue : defaultValue;
  }
  return defaultValue;
};
