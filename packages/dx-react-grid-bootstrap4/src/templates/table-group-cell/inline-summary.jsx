import * as React from 'react';
import * as PropTypes from 'prop-types';

export const InlineSummary = ({
  inlineSummaries, getMessage, inlineSummaryItemComponent: InlineSummaryItem,
}) => (
  <span className="ml-2">
    <React.Fragment>
      {'('}
      {inlineSummaries.map(s => (
        <InlineSummaryItem
          summary={s}
          getMessage={getMessage}
        />
      ))
        .reduce((acc, summary) => acc.concat(summary, ', '), [])
        .slice(0, -1)}
      {')'}
    </React.Fragment>
  </span>
);

InlineSummary.propTypes = {
  inlineSummaries: PropTypes.array,
  getMessage: PropTypes.func.isRequired,
  inlineSummaryItemComponent: PropTypes.func.isRequired,
};

InlineSummary.defaultProps = {
  inlineSummaries: [],
};
