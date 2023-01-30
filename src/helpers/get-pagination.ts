export const getPagination = (page: string, perPage: string) => {
  const pageNumber = Number(page) > 0 ? Number(page) : 1;
  const perPageNumber = Number(perPage) > 0 ? Number(perPage) : 10;
  const skip = pageNumber * perPageNumber - perPageNumber;
  return [pageNumber, perPageNumber, skip];
};
