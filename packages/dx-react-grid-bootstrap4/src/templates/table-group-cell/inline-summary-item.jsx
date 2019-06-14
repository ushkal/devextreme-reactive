import * as React from 'react';
import * as PropTypes from 'prop-types';

export const InlineSummaryItem = React.memo(({ summary, getMessage }) => (
  <React.Fragment>
    {getMessage(summary.messageKey, { columnTitle: summary.columnTitle })}
    <summary.component />
  </React.Fragment>
));

InlineSummaryItem.propTypes = {
  getMessage: PropTypes.func.isRequired,
  summary: PropTypes.object.isRequired,
};
