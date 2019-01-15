type INthRowOnPage = (currentPage: number, pageSize: number, totalCount: number) => number;

export const firstRowOnPage: INthRowOnPage = (currentPage, pageSize, totalCount) => {
  if (totalCount === 0) {
    return 0;
  }
  return pageSize ? (currentPage * pageSize) + 1 : 1;
};

export const lastRowOnPage: INthRowOnPage = (currentPage, pageSize, totalRowCount) => {
  let result = totalRowCount;
  if (pageSize) {
    const index = (currentPage + 1) * pageSize;
    result = index > totalRowCount ? totalRowCount : index;
  }

  return result;
};

type ICalculateStartPage = (
  currentPage: number, maxButtonCount: number, totalPageCount: number,
) => number;
export const calculateStartPage: ICalculateStartPage = (
  currentPage, maxButtonCount, totalPageCount,
) => (
  Math.max(
    Math.min(
    currentPage - Math.floor(maxButtonCount / 2),
      (totalPageCount - maxButtonCount) + 1,
    ),
    1,
  )
);
