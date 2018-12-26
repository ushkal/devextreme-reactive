import * as React from 'react';
import * as PropTypes from 'prop-types';

export const InlineSummaryItem = ({ summary, getMessage }) => (
  <React.Fragment>
    {getMessage(summary.type, { columnName: summary.column.name })}
    <summary.component />
  </React.Fragment>
);
