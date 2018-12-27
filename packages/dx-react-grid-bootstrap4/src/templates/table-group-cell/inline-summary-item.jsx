import * as React from 'react';
import * as PropTypes from 'prop-types';

export const InlineSummaryItem = ({ summary, getMessage }) => (
  <React.Fragment>
    {getMessage(summary.messageKey, { columnTitle: summary.columnTitle })}
    <summary.component />
  </React.Fragment>
);
