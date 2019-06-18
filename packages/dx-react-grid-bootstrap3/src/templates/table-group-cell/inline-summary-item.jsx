import * as React from 'react';
import * as PropTypes from 'prop-types';

// TODO: may be move to react-grid since its same across themes
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
