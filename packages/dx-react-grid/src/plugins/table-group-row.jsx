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
} from '@devexpress/dx-grid-core';
import { TableSummaryContent } from '../components/table-summary-content';

const pluginDependencies = [
  { name: 'GroupingState' },
  { name: 'Table' },
  { name: 'DataTypeProvider', optional: true },
];

const defaultTypelessSummaries = ['count'];

const defaultMessages = {
  count: () => 'Count: ',
  sum: ({ columnName }) => `Sum of ${columnName} is `,
  max: ({ columnName }) => `Max of ${columnName} is `,
  min: ({ columnName }) => `Min of ${columnName} is `,
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

const columnContainsGroupRowSummary = (tableColumn, groupSummaryItems) => (
  groupSummaryItems
    .find(summaryItem => (
      summaryItem.showInGroupRow && summaryItem.columnName === tableColumn.column.name
    ))
);
const isGroupRowSummaryCell = (tableRow, tableColumn, groupSummaryItems, grouping) => {
  console.log(groupSummaryItems)
  return (
    groupSummaryItems
    && isGroupTableRow(tableRow)
    && !isGroupTableCell(tableRow, tableColumn)
    && !isGroupIndentTableCell(tableRow, tableColumn, grouping)
    && columnContainsGroupRowSummary(tableColumn, groupSummaryItems)
)};

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
                  const inlineSummaries = getGroupInlineSummaries(
                    groupSummaryItems, tableColumns,
                    groupSummaryValues[params.tableRow.row.compoundKey],
                  ).map(colSummary => ([
                    ...colSummary.summaries.map(s => ({
                      ...s,
                      column: colSummary.column,
                      component: () => (
                        defaultTypelessSummaries.includes(s.type)
                          ? s.value
                          : (
                            <TemplatePlaceholder
                              key={s.type}
                              name="valueFormatter"
                              params={{
                                column: colSummary.column,
                                value: s.value,
                              }}
                            >
                              {content => content}
                            </TemplatePlaceholder>
                          )
                      ),
                    })),
                  ])).reduce((acc, summaries) => acc.concat(summaries), []);
                  console.log(inlineSummaries)

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
          predicate={(
            params
          //   {
          //   tableRow, tableColumn, groupSummaryItems, grouping,
          // }
          ) => {
            console.log(params)
            return false;
            // isGroupRowSummaryCell(tableRow, tableColumn, groupSummaryItems, grouping)
          }}
        >
          {params => (
            <TemplateConnector>
              {({
                groupSummaryItems, groupSummaryValues, grouping,
              }) => {
                if (!(isGroupTableCell(params.tableRow, params.tableColumn)
                    || isGroupIndentTableCell(params.tableRow, params.tableColumn, grouping))
                    && groupSummaryItems.find(summaryItem => (
                      summaryItem.showInGroupRow
                      && summaryItem.columnName === params.tableColumn.column.name
                    ))) {
                  const columnSummaries = getColumnSummaries(
                    groupSummaryItems,
                    params.tableColumn.column.name,
                    groupSummaryValues[params.tableRow.row.compoundKey],
                    summaryItem => summaryItem.showInGroupRow,
                  );

                  return (
                    <GroupCell
                      {...params}
                      column={params.tableColumn.column}
                    >
                      <TableSummaryContent
                        column={params.tableColumn.column}
                        columnSummaries={columnSummaries}
                        formatlessSummaryTypes={formatlessSummaryTypes}
                        itemComponent={RowSummaryItem}
                        messages={messages}
                      />
                    </GroupCell>
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
  indentColumnWidth: PropTypes.number.isRequired,
  showColumnsWhenGrouped: PropTypes.bool,
  columnExtensions: PropTypes.array,
  formatlessSummaryTypes: PropTypes.array,
};

TableGroupRow.defaultProps = {
  indentCellComponent: null,
  showColumnsWhenGrouped: false,
  columnExtensions: undefined,
  formatlessSummaryTypes: [],
};

TableGroupRow.components = {
  rowComponent: 'Row',
  cellComponent: 'Cell',
  contentComponent: 'Content',
  iconComponent: 'Icon',
  inlineSummaryComponent: 'InlineSummary',
  inlineSummaryItemComponent: 'InlineSummaryItem',
  rowSummaryItemComponent: 'RowSummaryItem',
};
