export interface SummaryItem {
  /** The name of a column associated with the current summary item. */
  columnName: string;
  /** A summary type. */
  type: SummaryType;
}
export type SummaryType = string;
