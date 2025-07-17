// categoryType.ts
export type Subcategory = {
  id: number;
  name: string;
};

export type Category = {
  id: number;
  name: string;
  subcategories: Subcategory[];
};

export type CategoriesResponse = {
  success: boolean;
  data: Category[];
  message?: string;
};

export type SubcategoriesResponse = {
  success: boolean;
  data: Subcategory[];
  message?: string;
};
