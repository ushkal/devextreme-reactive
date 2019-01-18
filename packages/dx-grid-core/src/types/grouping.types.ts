import { Column } from './grid-core.types';

/** Describes grouping options. */
export interface Grouping {
  /** Specifies the name of the column by which the data is grouped. */
  columnName: string;
}
/** Describes a group that can be nested in another one. */
export type GroupKey = string;

export type GroupingPanelItem = { column: Column, draft: boolean };

export type DraftGroupingState = { draftGrouping: Grouping[] | null };
export type ColumnGroupingState = { grouping?: Grouping[], expandedGroups?: ReadonlyArray<string> };
export type ChangeGroupingPayload = { columnName: string, groupIndex: number };
export type ToggleGroupPayload = { groupKey: GroupKey };

type ChildGroup = { key: number | string, value?: any, childRows?: any[] };
/*** A function that extracts groups from the specified data.
 * It is executed recursively for the root and nested groups. */
export type GetChildGroupsFn = (
  currentRows: any[], grouping: Grouping, rootRows: any[],
) => ChildGroup[];

export type GroupingCriteriaFn = (value: any, row?: any) => { key: string | number, value?: any };
