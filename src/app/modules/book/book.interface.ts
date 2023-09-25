export type IBookFiltersRequest = {
  search?: string | undefined;
  genre?: string | undefined;
  category?: string | undefined;
  publicationDate?: string | undefined;
  minPrice?: number;
  maxPrice?: number;
};
