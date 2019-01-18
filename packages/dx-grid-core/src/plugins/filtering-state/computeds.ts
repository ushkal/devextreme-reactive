import { FilterExpression, Filter } from '../../types';
import { PureComputed } from '@devexpress/dx-core';

export const filterExpression: PureComputed<
  [Filter[], FilterExpression], FilterExpression
> = (filters, expression) => {
  const selfFilterExpr = { filters, operator: 'and' as 'and' };
  if (!expression) {
    return selfFilterExpr;
  }
  return {
    operator: 'and' as 'and',
    filters: [expression, selfFilterExpr],
  };
};
