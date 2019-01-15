import { ColumnOrder } from '../../types';

type ChangeColumnOrderPayload = { sourceColumnName: string, targetColumnName: string };
type ChangeColumnOrderReducer = (
  order: ColumnOrder, payload: ChangeColumnOrderPayload,
) => ColumnOrder;

export const changeColumnOrder: ChangeColumnOrderReducer = (
  order, { sourceColumnName, targetColumnName },
) => {
  const sourceColumnIndex = order.indexOf(sourceColumnName);
  const targetColumnIndex = order.indexOf(targetColumnName);
  const newOrder = order.slice();

  newOrder.splice(sourceColumnIndex, 1);
  newOrder.splice(targetColumnIndex, 0, sourceColumnName);
  return newOrder;
};
