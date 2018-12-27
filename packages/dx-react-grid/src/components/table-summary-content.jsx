import * as React from 'react';
import { getMessagesFormatter } from '@devexpress/dx-core';
import { defaultFormatlessSummaries } from '@devexpress/dx-grid-core';
import { TemplatePlaceholder } from '@devexpress/dx-react-core';

export const defaultSummaryMessages = {
  sum: 'Sum',
  min: 'Min',
  max: 'Max',
  avg: 'Avg',
  count: 'Count',
};

export const TableSummaryContent = ({
  column, columnSummaries, formatlessSummaryTypes,
  itemComponent: Item,
  messages,
}) => {
  const getMessage = getMessagesFormatter({ ...defaultSummaryMessages, ...messages });
  const SummaryItem = ({ summary, children }) => (
    <Item
      getMessage={getMessage}
      type={summary.type}
      value={summary.value}
    >
      {children || String(summary.value)}
    </Item>
  );

  return (
    <React.Fragment>
      {columnSummaries.map((summary) => {
        if (summary.value === null
          || formatlessSummaryTypes.includes(summary.type)
          || defaultFormatlessSummaries.includes(summary.type)) {
          return <SummaryItem key={summary.type} summary={summary} />;
        }
        return (
          <TemplatePlaceholder
            key={summary.type}
            name="valueFormatter"
            params={{
              column,
              value: summary.value,
            }}
          >
            {content => (
              <SummaryItem summary={summary}>
                {content}
              </SummaryItem>
            )}
          </TemplatePlaceholder>
        );
      })}
    </React.Fragment>
  );
};
