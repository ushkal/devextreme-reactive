import { Filters, FilterExpression } from '../../types';

export const filterExpression = (filters: Filters, expression: FilterExpression) => {
  const selfFilterExpr = { filters, operator: 'and' };
  if (!expression) {
    return selfFilterExpr;
  }
  return {
    operator: 'and',
    filters: [expression, selfFilterExpr],
  };
};
