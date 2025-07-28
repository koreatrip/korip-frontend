// categoryAPI.ts
import axios from 'axios';
import {
  type CategoriesResponse,
  type SubcategoriesResponse,
} from './categoryType';

export const categoryAPI = {
  getAllCategories: async (
    lang: string = 'ko'
  ): Promise<CategoriesResponse> => {
    const response = await axios.get('/api/categories', {
      params: { lang },
      headers: { Accept: 'application/json' },
    });
    return response.data;
  },

  getSubcategories: async (
    categoryId: number,
    lang: string = 'ko'
  ): Promise<SubcategoriesResponse> => {
    const response = await axios.get(
      `/api/categories/${categoryId}/subcategories`,
      {
        params: { lang },
        headers: { Accept: 'application/json' },
      }
    );
    return response.data;
  },
};
