export interface ColumnBands {
  /** A column name that is used to identify a column in the bands tree. */
  columnName?: string;
  /** The band's title. Used only for bands and ignored for columns. */
  title?: string;
  /** Nested bands and columns. */
  children?: ColumnBands[];
}

export type GetMaxNestedLevelFn = (
  bands: ColumnBands[], level?: number, result?: { level: number } | null,
) => { level: number };

type ColumnBandMeta = { level: number, title: string | null };

export type GetColumnBandMetaFn = (
  columnName: string, bands: ReadonlyArray<ColumnBands>, tableRowLevel: number,
  level?: number, title?: string | null | undefined, result?: ColumnBandMeta | null,
) => ColumnBandMeta;
