import { Column } from './grid-core.types';

/** Describes properties of a table row that the Table plugin renders. */
export interface TableRow {
  /** A unique table row identifier. */
  key: string;
  /*** Specifies the table row type. The specified value defines which cell template
   * is used to render the row. */
  type: symbol;
  /** Specifies the associated row's ID. */
  rowId?: number | string;
  /** Specifies the associated row. */
  row?: any;
  /** Specifies the table row height. */
  height?: number;
}

/** Describes properties of a table column that the Table plugin renders. */
export interface TableColumn {
  /** A unique table column identifier. */
  key: string;
  /*** Specifies the table column type. The specified value defines which cell template
   * is used to render the column. */
  type: symbol;
  /** Specifies the associated user column. */
  column?: Column;
  /** Specifies the table column width. */
  width?: number;
  /** Specifies the table's column alignment. */
  align?: 'left' | 'right' | 'center';
  /** Specifies the fixed table's column alignment. */
  fixed?: 'left' | 'right';
}

export type TableColumns = ReadonlyArray<TableColumn>;
export type TableRows = ReadonlyArray<TableRow>;
