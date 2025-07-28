// categoryHooks.ts
import { useQuery } from '@tanstack/react-query';
import { categoryQueries } from './categoryQueries';

export const useAllCategoriesQuery = (lang: string = 'ko', options?: any) => {
  return useQuery({
    ...categoryQueries.categories.all(lang),
    ...options,
  });
};

export const useSubcategoriesQuery = (
  categoryId: number,
  lang: string = 'ko',
  options?: any
) => {
  return useQuery({
    ...categoryQueries.categories.subcategories(categoryId, lang),
    enabled: !!categoryId,
    ...options,
  });
};
