export type Category = {
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

// export type interestPost = {
//   id: number[];
// };
