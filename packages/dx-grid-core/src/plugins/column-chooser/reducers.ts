export const toggleColumn = (hiddenColumnNames: string[], columnName: string) => (
  hiddenColumnNames.indexOf(columnName) === -1
    ? [...hiddenColumnNames, columnName]
    : hiddenColumnNames.filter(hiddenColumn => hiddenColumn !== columnName)
);
