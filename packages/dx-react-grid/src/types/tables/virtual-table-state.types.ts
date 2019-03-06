export interface VirtualTableStateProps {
  start: number;
  rowCount: number;
  overscan?: number;
  defaultOverscan?: number;
  getRows: (skip: number, take: number) => void;
  onFirstRowIndexChange?: (index: number) => void;
  onViewportTopChange?: (top: number) => void;
}

export type VirtualTableStateState = {
  virtualRowsCache: any,
  start: number;
  rowCount?: number;
  viewportTop: number;
  requestedPageIndex?: number,
  currentVirtualPageTop: number;
  lastQueryTime: number;
  loadedRowsStart: number;
  // rowsCache: any[],
  // visibleBoundaries: any,
};