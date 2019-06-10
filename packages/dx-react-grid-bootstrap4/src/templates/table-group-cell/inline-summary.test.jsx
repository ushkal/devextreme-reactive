import * as React from 'react';
import { mount } from 'enzyme';
import { InlineSummary } from './inline-summary';

describe('InlineSummary component', () => {
  const defaultProps = {
    inlineSummaries: [],
    getMessage: jest.fn(),
    inlineSummaryItemComponent: () => null,
  };
  const summaries = [
    { type: 'min', value: 3 },
    { type: 'count', value: 10 },
  ];

  it('should render summaries by using InlineSummaryItem component', () => {
    const tree = mount((
      <InlineSummary
        {...defaultProps}
        inlineSummaries={summaries}
      />
    ));

    expect(tree.find(defaultProps.inlineSummaryItemComponent)
      .map(item => item.props()))
        .toEqual([
          {
            summary: summaries[0],
            getMessage: defaultProps.getMessage,
          },
          {
            summary: summaries[1],
            getMessage: defaultProps.getMessage,
          },
        ]);
  });

  it('should format summary text', () => {
    const SummaryItem = ({ summary }) => summary.value;
    const tree = mount((
      <InlineSummary
        {...defaultProps}
        inlineSummaries={summaries}
        inlineSummaryItemComponent={SummaryItem}
      />
    ));

    expect(tree.text())
      .toBe('(3, 10)');
  });
});
