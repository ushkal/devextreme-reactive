import * as React from 'react';
import {
  Template, Getter, Plugin, TemplateConnector, TemplatePlaceholder, PluginComponents,
} from '@devexpress/dx-react-core';
import { isTreeTableCell } from '@devexpress/dx-grid-core';
import { TableTreeColumnProps, CellProps } from '../types';

class TableTreeColumnBase extends React.PureComponent<TableTreeColumnProps> {
  static components: PluginComponents;

  render() {
    const {
      for: forColumnName,
      showSelectionControls,
      showSelectAll,
      indentComponent: Indent,
      expandButtonComponent: ExpandButton,
      checkboxComponent: Checkbox,
      contentComponent: Content,
      cellComponent: Cell,
    } = this.props;
    return (
      <Plugin
        name="TableTreeColumn"
        dependencies={[
          { name: 'DataTypeProvider', optional: true },
          { name: 'TreeDataState' },
          { name: 'SelectionState', optional: !showSelectionControls },
          { name: 'IntegratedSelection', optional: !showSelectAll },
          { name: 'Table' },
          { name: 'TableHeaderRow', optional: true },
        ]}
      >
        <Getter name="tableTreeColumnName" value={forColumnName} />
        <Template
          name="tableHeaderCellBefore"
          predicate={({ column }: any) => column.name === forColumnName}
        >
          <ExpandButton
            visible={false}
            // TODO: why it compiled before?
            expanded={false}
            onToggle={() => {}}
          />
          {showSelectionControls && showSelectAll && (
            <TemplateConnector>
              {({ selectAllAvailable, allSelected, someSelected }, { toggleSelectAll }) => (
                <Checkbox
                  disabled={!selectAllAvailable}
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={toggleSelectAll}
                />
              )}
            </TemplateConnector>
          )}
        </Template>
        <Template
          name="tableCell"
          predicate={(
            { tableRow, tableColumn }: any,
          ) => isTreeTableCell(tableRow, tableColumn, forColumnName)}
        >
          {(params: CellProps) => (
            <TemplateConnector>
              {({
                getCollapsedRows, expandedRowIds, selection, isTreeRowLeaf, getTreeRowLevel,
                getCellValue,
              }, {
                toggleRowExpanded, toggleSelection,
              }) => {
                const { row, rowId } = params.tableRow;
                const columnName = params.tableColumn.column!.name;
                const value = getCellValue(row, columnName);
                const collapsedRows = getCollapsedRows(row);
                return (
                  <TemplatePlaceholder
                    name="valueFormatter"
                    params={{
                      row,
                      column: params.tableColumn.column,
                      value,
                    }}
                  >
                    {content => (
                      <Cell
                        {...params}
                        row={row}
                        column={params.tableColumn.column!}
                        value={value}
                      >
                        <Indent
                          level={getTreeRowLevel(row)}
                        />
                        <ExpandButton
                          visible={collapsedRows ? !!collapsedRows.length : !isTreeRowLeaf(row)}
                          expanded={expandedRowIds.indexOf(rowId) > -1}
                          onToggle={() => toggleRowExpanded({ rowId })}
                        />
                        {showSelectionControls && (
                          <Checkbox
                            disabled={false}
                            checked={selection.indexOf(rowId) > -1}
                            indeterminate={false}
                            onChange={() => toggleSelection({ rowIds: [rowId] })}
                          />
                        )}
                        <Content>
                          {content || value}
                        </Content>
                      </Cell>
                    )}
                  </TemplatePlaceholder>
                );
              }}
            </TemplateConnector>
          )}
        </Template>
      </Plugin>
    );
  }
}

TableTreeColumnBase.components = {
  cellComponent: 'Cell',
  contentComponent: 'Content',
  indentComponent: 'Indent',
  expandButtonComponent: 'ExpandButton',
  checkboxComponent: 'Checkbox',
};

export const TableTreeColumn: React.ComponentType<TableTreeColumnProps> = TableTreeColumnBase;
