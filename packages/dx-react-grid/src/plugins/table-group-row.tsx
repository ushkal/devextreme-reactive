import * as React from 'react';
import { getMessagesFormatter } from '@devexpress/dx-core';
import {
  Getter, Template, Plugin, TemplatePlaceholder, TemplateConnector, Getters,
} from '@devexpress/dx-react-core';
import {
  tableColumnsWithGrouping,
  tableRowsWithGrouping,
  tableGroupCellColSpanGetter,
  isGroupTableCell,
  isGroupIndentTableCell,
  isGroupTableRow,
  TABLE_GROUP_TYPE,
  getColumnSummaries,
  defaultFormatlessSummaries,
  isPreviousCellContainSummary,
  isRowSummaryCell,
  isGroupRowOrdinaryCell,
} from '@devexpress/dx-grid-core';
import {
  TableGroupRowProps, ShowColumnWhenGroupedGetterFn, TableCellProps, TableRowProps,
} from '../types';
import { TableSummaryContent } from '../components/summary/table-summary-content';
import { flattenGroupInlineSummaries } from '../components/summary/group-summaries';

const pluginDependencies = [
  { name: 'GroupingState' },
  { name: 'Table' },
  { name: 'DataTypeProvider', optional: true },
  { name: 'SummaryState', optional: true },
  { name: 'CustomSummary', optional: true },
  { name: 'IntegratedSummary', optional: true },
  { name: 'Table' },
  { name: 'DataTypeProvider', optional: true },
  { name: 'TableSelection', optional: true },
];

const defaultMessages = {
  countOf: 'Count: ',
  sumOf: 'Sum of {columnTitle} is ',
  maxOf: 'Max of {columnTitle} is ',
  minOf: 'Min of {columnTitle} is ',
  avgOf: 'Avg of {columnTitle} is ',
};

const tableBodyRowsComputed = (
  { tableBodyRows, isGroupRow }: Getters,
) => tableRowsWithGrouping(tableBodyRows, isGroupRow);
const getCellColSpanComputed = (
  { getTableCellColSpan, groupSummaryItems }: Getters,
) => tableGroupCellColSpanGetter(getTableCellColSpan, groupSummaryItems);

const showColumnWhenGroupedGetter: ShowColumnWhenGroupedGetterFn = (
  showColumnsWhenGrouped, columnExtensions = [],
) => {
  const map = columnExtensions.reduce((acc, columnExtension) => {
    acc[columnExtension.columnName] = columnExtension.showWhenGrouped;
    return acc;
  }, {});

  return columnName => map[columnName] || showColumnsWhenGrouped;
};

class TableGroupRowBase extends React.PureComponent<TableGroupRowProps> {
  static ROW_TYPE = TABLE_GROUP_TYPE;
  static COLUMN_TYPE = TABLE_GROUP_TYPE;
  static defaultProps = {
    showColumnsWhenGrouped: false,
    formatlessSummaryTypes: [],
  };
  static components = {
    rowComponent: 'Row',
    cellComponent: 'Cell',
    contentComponent: 'Content',
    iconComponent: 'Icon',
    inlineSummaryComponent: 'InlineSummary',
    inlineSummaryItemComponent: 'InlineSummaryItem',
    rowSummaryCellComponent: 'RowSummaryCell',
    rowSummaryItemComponent: 'RowSummaryItem',
    stubCellComponent: 'StubCell',
  };

  render() {
    const {
      cellComponent: GroupCell,
      contentComponent: Content,
      iconComponent: Icon,
      rowComponent: GroupRow,
      indentCellComponent: GroupIndentCell,
      inlineSummaryComponent: InlineSummary,
      inlineSummaryItemComponent: InlineSummaryItem,
      rowSummaryCellComponent: RowSummaryCell,
      rowSummaryItemComponent: RowSummaryItem,
      stubCellComponent: StubCell,
      indentColumnWidth,
      showColumnsWhenGrouped,
      columnExtensions,
      messages,
      formatlessSummaryTypes,
    } = this.props;

    const getMessage = getMessagesFormatter({ ...defaultMessages, ...messages });

    const tableColumnsComputed = ({
      columns, tableColumns, grouping, draftGrouping,
    }: Getters) => tableColumnsWithGrouping(
      columns,
      tableColumns,
      grouping,
      draftGrouping,
      indentColumnWidth,
      showColumnWhenGroupedGetter(showColumnsWhenGrouped!, columnExtensions),
    );

    return (
      <Plugin
        name="TableGroupRow"
        dependencies={pluginDependencies}
      >
        <Getter name="tableColumns" computed={tableColumnsComputed} />
        <Getter name="tableBodyRows" computed={tableBodyRowsComputed} />
        <Getter name="getTableCellColSpan" computed={getCellColSpanComputed} />

        <Template
          name="tableCell"
          predicate={({ tableRow }: any) => isGroupTableRow(tableRow)}
        >
          {(params: TableCellProps) => (
            <TemplateConnector>
              {(
                {
                  grouping, expandedGroups, groupSummaryItems, groupSummaryValues, tableColumns,
                },
                { toggleGroupExpanded },
              ) => {
                if (isGroupTableCell(params.tableRow, params.tableColumn)) {
                  const formatlessSummaries = defaultFormatlessSummaries
                    .concat(formatlessSummaryTypes!);

                  const inlineSummaries = flattenGroupInlineSummaries(
                    tableColumns, params.tableRow, groupSummaryItems,
                    groupSummaryValues, formatlessSummaries,
                  );

                  return (
                    <TemplatePlaceholder
                      name="valueFormatter"
                      params={{
                        column: params.tableColumn.column,
                        value: params.tableRow.row.value,
                      }}
                    >
                      {content => (
                        <GroupCell
                          {...params}
                          contentComponent={Content}
                          iconComponent={Icon}
                          row={params.tableRow.row}
                          column={params.tableColumn.column!}
                          expanded={expandedGroups.indexOf(params.tableRow.row.compoundKey) !== -1}
                          onToggle={
                            () => toggleGroupExpanded({ groupKey: params.tableRow.row.compoundKey })
                          }
                          inlineSummaries={inlineSummaries}
                          inlineSummaryComponent={InlineSummary}
                          inlineSummaryItemComponent={InlineSummaryItem}
                          getMessage={getMessage}
                        >
                          {content}
                        </GroupCell>
                      )}
                    </TemplatePlaceholder>
                  );
                }
                if (isGroupIndentTableCell(params.tableRow, params.tableColumn, grouping)) {
                  if (GroupIndentCell) {
                    return (
                      <GroupIndentCell
                        {...params}
                        row={params.tableRow.row}
                        column={params.tableColumn.column!}
                      />
                    );
                  }
                  return <TemplatePlaceholder />;
                }
                return null;
              }}
            </TemplateConnector>
          )}
        </Template>
        <Template
          name="tableCell"
          predicate={({
            tableRow, tableColumn,
          }: any) => (isGroupRowOrdinaryCell(tableRow, tableColumn))}
        >
          {(params: TableCellProps) => (
            <TemplateConnector>
              {(
                {
                  groupSummaryItems, groupSummaryValues, grouping, tableColumns,
                },
                { toggleGroupExpanded },
              ) => {
                const { tableColumn, tableRow } = params;
                const onToggle = () => toggleGroupExpanded({ groupKey: tableRow.row.compoundKey });

                if (isRowSummaryCell(tableRow, tableColumn, grouping, groupSummaryItems)) {
                  const columnSummaries = getColumnSummaries(
                    groupSummaryItems,
                    tableColumn.column!.name,
                    groupSummaryValues[tableRow.row.compoundKey],
                    summaryItem => (summaryItem as any).showInGroupRow,
                  );

                  return (
                    <RowSummaryCell
                      {...params}
                      row={params.tableRow.row}
                      column={params.tableColumn.column}
                      onToggle={onToggle}
                    >
                      <TableSummaryContent
                        column={tableColumn.column!}
                        columnSummaries={columnSummaries}
                        formatlessSummaryTypes={formatlessSummaryTypes!}
                        itemComponent={RowSummaryItem}
                        messages={messages!}
                      />
                    </RowSummaryCell>
                  );
                }

                // NOTE: ensure that right-aligned summary will fit into a column
                if (isPreviousCellContainSummary(
                  tableRow, tableColumn, tableColumns, grouping, groupSummaryItems,
                )) {
                  return <StubCell {...params} onToggle={onToggle} />;
                }

                return <TemplatePlaceholder />;
              }}
            </TemplateConnector>
          )}
        </Template>
        <Template
          name="tableRow"
          predicate={({ tableRow }: any) => isGroupTableRow(tableRow)}
        >
          {(params: TableRowProps) => (
            <GroupRow
              {...params}
              row={params.tableRow.row}
            />
          )}
        </Template>
      </Plugin>
    );
  }
}

/** A plugin that renders group rows and enables them to expand and collapse. */
export const TableGroupRow: React.ComponentType<TableGroupRowProps> & {
  /** The group column type's identifier. */
  COLUMN_TYPE: symbol;
  /** The group row type's identifier. */
  ROW_TYPE: symbol;
} = TableGroupRowBase;
