import * as React from 'react';
import {
  Getter, Template, TemplatePlaceholder, TemplateConnector, Plugin, PluginComponents, Getters,
} from '@devexpress/dx-react-core';
import {
  getRowChange,
  tableRowsWithEditing,
  isEditTableRow,
  isAddedTableRow,
  isEditTableCell,
  TABLE_EDIT_TYPE,
  TABLE_ADDED_TYPE,
} from '@devexpress/dx-grid-core';
import { TableEditRowProps, CellProps, RowProps } from '../types';

const pluginDependencies = [
  { name: 'EditingState' },
  { name: 'Table' },
  { name: 'DataTypeProvider', optional: true },
];

class TableEditRowBase extends React.PureComponent<TableEditRowProps> {
  static ADDED_ROW_TYPE = TABLE_ADDED_TYPE;
  static EDIT_ROW_TYPE = TABLE_EDIT_TYPE;
  static components: PluginComponents;

  render() {
    const {
      cellComponent: EditCell,
      rowComponent: EditRow,
      rowHeight,
    } = this.props;

    const tableBodyRowsComputed = (
      { tableBodyRows, editingRowIds, addedRows }: Getters,
    ) => tableRowsWithEditing(tableBodyRows, editingRowIds, addedRows, rowHeight);

    return (
      <Plugin
        name="TableEditRow"
        dependencies={pluginDependencies}
      >
        <Getter name="tableBodyRows" computed={tableBodyRowsComputed} />
        <Template
          name="tableCell"
          predicate={({ tableRow, tableColumn }: any) => isEditTableCell(tableRow, tableColumn)}
        >
          {(params: CellProps) => (
            <TemplateConnector>
              {({
                getCellValue,
                createRowChange,
                rowChanges,
                isColumnEditingEnabled,
              }, {
                changeAddedRow,
                changeRow,
              }) => {
                const { rowId, row } = params.tableRow;
                const { column } = params.tableColumn;
                const { name: columnName } = column!;

                const isNew = isAddedTableRow(params.tableRow);
                const changedRow = isNew
                  ? row
                  : { ...row, ...getRowChange(rowChanges, rowId!) };

                const value = getCellValue(changedRow, columnName);
                const onValueChange = (newValue: any) => {
                  const changeArgs = {
                    rowId,
                    change: createRowChange(changedRow, newValue, columnName),
                  };
                  if (isNew) {
                    changeAddedRow(changeArgs);
                  } else {
                    changeRow(changeArgs);
                  }
                };
                return (
                  <TemplatePlaceholder
                    name="valueEditor"
                    params={{
                      column,
                      row,
                      value,
                      onValueChange,
                    }}
                  >
                    {content => (
                      <EditCell
                        {...params}
                        row={row}
                        column={column!}
                        value={value}
                        editingEnabled={isColumnEditingEnabled(columnName)}
                        onValueChange={onValueChange}
                      >
                        {content}
                      </EditCell>
                    )}
                  </TemplatePlaceholder>
                );
              }}
            </TemplateConnector>
          )}
        </Template>
        <Template
          name="tableRow"
          predicate={(
            { tableRow }: any,
          ) => !!(isEditTableRow(tableRow) || isAddedTableRow(tableRow))}
        >
          {(params: RowProps) => (
            <EditRow
              {...params}
              row={params.tableRow.row}
            />
          )}
        </Template>
      </Plugin>
    );
  }
}

TableEditRowBase.components = {
  rowComponent: 'Row',
  cellComponent: 'Cell',
};

export const TableEditRow: React.ComponentType<TableEditRowProps> = TableEditRowBase;