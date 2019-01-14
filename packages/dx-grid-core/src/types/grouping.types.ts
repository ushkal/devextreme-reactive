/** Describes grouping options. */
export interface Grouping {
  /** Specifies the name of the column by which the data is grouped. */
  columnName: string;
}
export type Groupings = ReadonlyArray<Grouping>;

/** Describes a group that can be nested in another one. */
export type GroupKey = string;
export type ExpandedGroups = ReadonlyArray<GroupKey>;

type ChildGroup = { key: number | string, value?: any, childRows?: any[] };
/*** A function that extracts groups from the specified data.
 * It is executed recursively for the root and nested groups. */
export type GetChildGroups = (
  currentRows: any[], grouping: Grouping, rootRows: any[],
) => ChildGroup[];

export type IGroupingCriteria = (value: any, row?: any) => { key: string | number, value?: any };
