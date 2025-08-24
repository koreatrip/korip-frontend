export type Category = {
  subcategories(subcategories: any): unknown;
  id: number;
  name: string;
};

export type Subcategory = {
  id: number;
  name: string;
};

export type CategoriesResponse = {
  categories: Category[];
  // subcategories: Subcategory[];
};

export type SubcategoriesResponse = {
  subcategories: Subcategory[];
};
