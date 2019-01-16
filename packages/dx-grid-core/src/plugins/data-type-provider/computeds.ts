import { Computed } from "@devexpress/dx-core";
import { GetAvailableFilterOperationsFn, FilterOperation } from "../../types";

export const getAvailableFilterOperationsGetter: Computed<
  GetAvailableFilterOperationsFn,
  FilterOperation[],
  string[]
> = (
  getAvailableFilterOperations,
  availableFilterOperations,
  columnNames,
) => columnName => (columnNames.indexOf(columnName) > -1 && availableFilterOperations)
    || (typeof getAvailableFilterOperations === 'function' && getAvailableFilterOperations(columnName))
    || undefined;
