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
  getGroupInlineSummaries,
  getColumnSummaries,
  defaultFormatlessSummaries,
} from '@devexpress/dx-grid-core';
import {
  TableGroupRowProps, ShowColumnWhenGroupedGetterFn, TableCellProps, TableRowProps,
} from '../types';

const pluginDependencies = [
  { name: 'DataTypeProvider', optional: true },
  { name: 'GroupingState' },
  { name: 'SummaryState', optional: true },
  { name: 'CustomSummary', optional: true },
  { name: 'IntegratedSummary', optional: true },
  { name: 'Table' },
  { name: 'DataTypeProvider', optional: true },
  { name: 'TableSelection', optional: true },
];

const defaultMessages = {
  countOf: 'Count: ',
  sumOf: 'Sum of {columnName} is ',
  maxOf: 'Max of {columnName} is ',
  minOf: 'Min of {columnName} is ',
  avgOf: 'Avg of {columnName} is ',
};

const tableBodyRowsComputed = (
  { tableBodyRows, isGroupRow }: Getters,
) => tableRowsWithGrouping(tableBodyRows, isGroupRow);
const getCellColSpanComputed = (
  { getTableCellColSpan, groupSummaryItems },
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

const columnHasGroupRowSummary = (tableColumn, groupSummaryItems) => (
  groupSummaryItems
    .find(summaryItem => (
      summaryItem.showInGroupRow && summaryItem.columnName === tableColumn.column.name
    ))
);
const isRowSummaryCell = (tableRow, tableColumn, grouping, groupSummaryItems) => (
  !isGroupIndentTableCell(tableRow, tableColumn, grouping)
  && columnHasGroupRowSummary(tableColumn, groupSummaryItems)
);
const isGroupRowOrdinaryCell = (tableRow, tableColumn) => (
  isGroupTableRow(tableRow) && !isGroupTableCell(tableRow, tableColumn)
);

const getInlineSummaryComponent = (column, summary, formatlessSummaries) => () => (
  (summary.value === null || formatlessSummaries.includes(summary.type))
    ? summary.value
    : (
      <TemplatePlaceholder
        key={summary.type}
        name="valueFormatter"
        params={{
          column,
          value: summary.value,
        }}
      >
        {content => content}
      </TemplatePlaceholder>
    )
);

const flattenGroupInlineSummaries = (
  tableColumns, tableRow, groupSummaryItems, groupSummaryValues, formatlessSummaries,
) => (
  getGroupInlineSummaries(
    groupSummaryItems, tableColumns,
    groupSummaryValues[tableRow.row.compoundKey],
  )
    .map(colSummaries => ([
      ...colSummaries.summaries.map(summary => ({
        ...summary,
        messageKey: `${summary.type}Of`,
        column: colSummaries.column,
        component: getInlineSummaryComponent(
          colSummaries.column, summary, formatlessSummaries,
        ),
      })),
    ]))
    .reduce((acc, summaries) => acc.concat(summaries), [])
);


class TableGroupRowBase extends React.PureComponent<TableGroupRowProps> {
  static ROW_TYPE = TABLE_GROUP_TYPE;
  static COLUMN_TYPE = TABLE_GROUP_TYPE;
  static defaultProps = {
    showColumnsWhenGrouped: false,
  };
  static components = {
    rowComponent: 'Row',
    cellComponent: 'Cell',
    contentComponent: 'Content',
    iconComponent: 'Icon',
    inlineSummaryComponent: 'InlineSummary',
    inlineSummaryItemComponent: 'InlineSummaryItem',
    rowSummaryItemComponent: 'RowSummaryItem',
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
                    .concat(formatlessSummaryTypes);

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
          }) => (isGroupRowOrdinaryCell(tableRow, tableColumn))}
        >
          {params => (
            <TemplateConnector>
              {(
                {
                  groupSummaryItems, groupSummaryValues, grouping,
                },
                { toggleGroupExpanded },
              ) => {
                const { tableColumn, tableRow } = params;
                if (isRowSummaryCell(tableRow, tableColumn, grouping, groupSummaryItems)) {
                  const columnSummaries = getColumnSummaries(
                    groupSummaryItems,
                    tableColumn.column.name,
                    groupSummaryValues[tableRow.row.compoundKey],
                    summaryItem => summaryItem.showInGroupRow,
                  );

                  return (
                    <RowSummaryCell
                      {...params}
                      onToggle={
                        () => toggleGroupExpanded({ groupKey: tableRow.row.compoundKey })
                      }
                    >
                      <TableSummaryContent
                        column={tableColumn.column}
                        columnSummaries={columnSummaries}
                        formatlessSummaryTypes={formatlessSummaryTypes}
                        itemComponent={RowSummaryItem}
                        messages={messages}
                      />
                    </RowSummaryCell>
                  );
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
