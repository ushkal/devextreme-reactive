import { clamp } from './helpers';
import { Rows, GetRowLevelKeyFn } from '../../types';

// tslint:disable-next-line:max-line-length
const PAGE_HEADERS_OVERFLOW_ERROR = 'Max row level exceeds the page size. Consider increasing the page size.';

export const paginatedRows = (rows: Rows, pageSize: number, page: number) => (
  pageSize
    ? rows.slice(pageSize * page, pageSize * (page + 1))
    : rows
);

export const rowsWithPageHeaders = (
  rows: Rows, pageSize: number, getRowLevelKey: GetRowLevelKeyFn,
) => {
  if (!pageSize || !getRowLevelKey) return rows;

  let result = rows.slice();

  let headerRows: any[] = [];
  let currentIndex = 0;
  while (result.length > currentIndex) {
    const row = result[currentIndex];
    const levelKey = getRowLevelKey(row);
    if (levelKey) {
      const headerIndex = headerRows.findIndex(headerRow => getRowLevelKey(headerRow) === levelKey);
      // tslint:disable-next-line:prefer-conditional-expression
      if (headerIndex === -1) {
        headerRows = [...headerRows, row];
      } else {
        headerRows = [...headerRows.slice(0, headerIndex), row];
      }
      if (headerRows.length >= pageSize) {
        throw new Error(PAGE_HEADERS_OVERFLOW_ERROR);
      }
    }
    const indexInPage = currentIndex % pageSize;
    if (indexInPage < headerRows.length && row !== headerRows[indexInPage]) {
      result = [
        ...result.slice(0, currentIndex),
        headerRows[indexInPage],
        ...result.slice(currentIndex),
      ];
    }
    currentIndex += 1;
  }

  return result;
};

export const rowCount = (rows: Rows) => rows.length;

export const pageCount = (count: number, pageSize: number) => (
  pageSize ? Math.ceil(count / pageSize) : 1
);

export const currentPage = (
  page: number, totalCount: number, pageSize: number, setCurrentPage: (page: number) => void,
) => {
  const totalPages = pageCount(totalCount, pageSize);
  const adjustedCurrentPage = clamp(page, totalPages - 1);
  if (page !== adjustedCurrentPage) {
    setTimeout(() => setCurrentPage(adjustedCurrentPage));
  }
  return adjustedCurrentPage;
};
