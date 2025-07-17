// categoryQueries.ts
import { createQueryKeyStore } from '@lukemorales/query-key-factory';
import { categoryAPI } from './categoryAPI';

export const categoryQueries = createQueryKeyStore({
  categories: {
    all: (lang: string = 'ko') => ({
      queryKey: ['categories', 'all', lang],
      queryFn: () => categoryAPI.getAllCategories(lang),
    }),

    subcategories: (categoryId: number, lang: string = 'ko') => ({
      queryKey: ['categories', 'subcategories', categoryId, lang],
      queryFn: () => categoryAPI.getSubcategories(categoryId, lang),
    }),
  },
});
