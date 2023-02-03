export const getPagination = (page: string, per_page: string) => {
  const page_number = Number(page) > 0 ? Number(page) : 1;
  const per_page_number = Number(per_page) > 0 ? Number(per_page) : 10;
  const skip = page_number * per_page_number - per_page_number;
  return { page_number, per_page_number, skip };
};
