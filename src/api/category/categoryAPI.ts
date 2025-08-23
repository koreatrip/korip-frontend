// categoryAPI.ts
import axios from 'axios';
import {
  type CategoriesResponse,
  type SubcategoriesResponse,
} from './categoryType';

export const categoryAPI = {
  getAllCategories: async (lang: string): Promise<CategoriesResponse> => {
    const response = await axios.get('/api/categories', {
      params: { lang },
      headers: { Accept: 'application/json' },
    });
    console.log(response.data);
    return response.data;
  },

  getSubcategories: async (
    categoryId: number,
    lang: string
  ): Promise<SubcategoriesResponse> => {
    const response = await axios.get(
      `/api/categories/${categoryId}/subcategories`,
      {
        params: { lang },
        headers: { Accept: 'application/json' },
      }
    );
    console.log(response.data);
    return response.data;
  },
};
