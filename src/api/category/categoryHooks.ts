// categoryHooks.ts
import { useQuery } from '@tanstack/react-query';
import { categoryQueries } from './categoryQueries';
import type { CategoriesResponse } from './categoryType';

export const useAllCategoriesQuery = (lang: string, options?: any) => {
  return useQuery<CategoriesResponse>({
    ...categoryQueries.categories.all(lang),
    ...options,
  });
};

export const useSubcategoriesQuery = (
  categoryId: number,
  lang: string,
  options?: any
) => {
  return useQuery({
    ...categoryQueries.categories.subcategories(categoryId, lang),
    enabled: !!categoryId,
    ...options,
  });
};
