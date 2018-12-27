import * as React from 'react';
import * as PropTypes from 'prop-types';
import { getMessagesFormatter } from '@devexpress/dx-core';
import {
  Getter, Template, Plugin, TemplatePlaceholder, TemplateConnector,
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
import { TableSummaryContent } from '../components/table-summary-content';

const pluginDependencies = [
  { name: 'GroupingState' },
  { name: 'Table' },
  { name: 'DataTypeProvider', optional: true },
  { name: 'SummaryState', optional: true },
  { name: 'CustomSummary', optional: true },
  { name: 'IntegratedSummary', optional: true },
];

const defaultMessages = {
  countOf: 'Count: ',
  sumOf: 'Sum of {columnTitle} is ',
  maxOf: 'Max of {columnTitle} is ',
  minOf: 'Min of {columnTitle} is ',
  avgOf: 'Avg of {columnTitle} is ',
};

const tableBodyRowsComputed = (
  { tableBodyRows, isGroupRow },
) => tableRowsWithGrouping(tableBodyRows, isGroupRow);
const getCellColSpanComputed = (
  { getTableCellColSpan, groupSummaryItems },
) => tableGroupCellColSpanGetter(getTableCellColSpan, groupSummaryItems);

const showColumnWhenGroupedGetter = (showColumnsWhenGrouped, columnExtensions = []) => {
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
        columnTitle: colSummaries.column.title,
        messageKey: `${summary.type}Of`,
        component: getInlineSummaryComponent(
          colSummaries.column, summary, formatlessSummaries,
        ),
      })),
    ]))
    .reduce((acc, summaries) => acc.concat(summaries), [])
);


export class TableGroupRow extends React.PureComponent {
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
    }) => tableColumnsWithGrouping(
      columns,
      tableColumns,
      grouping,
      draftGrouping,
      indentColumnWidth,
      showColumnWhenGroupedGetter(showColumnsWhenGrouped, columnExtensions),
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
          predicate={({ tableRow }) => isGroupTableRow(tableRow)}
        >
          {params => (
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
                          column={params.tableColumn.column}
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
                        column={params.tableColumn.column}
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
                      row={params.tableRow.row}
                      column={params.tableColumn.column}
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
          predicate={({ tableRow }) => isGroupTableRow(tableRow)}
        >
          {params => (
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

TableGroupRow.ROW_TYPE = TABLE_GROUP_TYPE;
TableGroupRow.COLUMN_TYPE = TABLE_GROUP_TYPE;

TableGroupRow.propTypes = {
  cellComponent: PropTypes.func.isRequired,
  contentComponent: PropTypes.func.isRequired,
  iconComponent: PropTypes.func.isRequired,
  rowComponent: PropTypes.func.isRequired,
  indentCellComponent: PropTypes.func,
  inlineSummaryComponent: PropTypes.func.isRequired,
  inlineSummaryItemComponent: PropTypes.func.isRequired,
  rowSummaryCellComponent: PropTypes.func.isRequired,
  rowSummaryItemComponent: PropTypes.func.isRequired,
  indentColumnWidth: PropTypes.number.isRequired,

  showColumnsWhenGrouped: PropTypes.bool,
  columnExtensions: PropTypes.array,
  formatlessSummaryTypes: PropTypes.array,
  messages: PropTypes.shape({
    sum: PropTypes.string,
    min: PropTypes.string,
    max: PropTypes.string,
    avg: PropTypes.string,
    count: PropTypes.string,
    sumOf: PropTypes.string,
    minOf: PropTypes.string,
    maxOf: PropTypes.string,
    avgOf: PropTypes.string,
    countOf: PropTypes.string,
  }),
};

TableGroupRow.defaultProps = {
  indentCellComponent: null,
  showColumnsWhenGrouped: false,
  columnExtensions: undefined,
  formatlessSummaryTypes: [],
  messages: {},
};

TableGroupRow.components = {
  rowComponent: 'Row',
  cellComponent: 'Cell',
  contentComponent: 'Content',
  iconComponent: 'Icon',
  inlineSummaryComponent: 'InlineSummary',
  inlineSummaryItemComponent: 'InlineSummaryItem',
  rowSummaryCellComponent: 'RowSummaryCell',
  rowSummaryItemComponent: 'RowSummaryItem',
};
