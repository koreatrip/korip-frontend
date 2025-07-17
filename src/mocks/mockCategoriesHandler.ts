// msw/handlers.ts
import { http, HttpResponse } from 'msw';
import type {
  Category,
  CategoriesResponse,
  SubcategoriesResponse,
} from '../api/category/categoryType';

const mockCategories: Category[] = [
  {
    id: 1,
    name: '문화',
    subcategories: [
      { id: 1, name: '역사' },
      { id: 2, name: '박물관' },
      { id: 3, name: '미술관' },
      { id: 4, name: '전통문화' },
      { id: 5, name: '종교' },
      { id: 6, name: '궁궐' },
    ],
  },
  {
    id: 2,
    name: '자연',
    subcategories: [
      { id: 7, name: '산' },
      { id: 8, name: '바다' },
      { id: 9, name: '강' },
      { id: 10, name: '호수' },
      { id: 11, name: '계곡' },
      { id: 12, name: '공원' },
      { id: 13, name: '숲' },
    ],
  },
  {
    id: 3,
    name: '액티비티',
    subcategories: [
      { id: 14, name: '등산' },
      { id: 15, name: '테마파크' },
      { id: 16, name: '놀이공원' },
      { id: 17, name: '동물원' },
      { id: 18, name: '수족관' },
    ],
  },
  {
    id: 4,
    name: '쇼핑',
    subcategories: [
      { id: 19, name: '전통시장' },
      { id: 20, name: '백화점' },
      { id: 21, name: '아울렛' },
      { id: 22, name: '면세점' },
      { id: 23, name: '기념품' },
      { id: 24, name: '패션' },
      { id: 25, name: '화장품' },
    ],
  },
  {
    id: 5,
    name: '음식',
    subcategories: [
      { id: 26, name: '한식' },
      { id: 27, name: '일식' },
      { id: 28, name: '중식' },
      { id: 29, name: '양식' },
    ],
  },
  {
    id: 6,
    name: 'kpop',
    subcategories: [
      { id: 30, name: '방탄소년단' },
      { id: 31, name: '블랙핑크' },
      { id: 32, name: '에스파' },
      { id: 33, name: '뉴진스' },
      { id: 34, name: '세븐틴' },
    ],
  },
];

export const mockCategoriesHandlers = [
  // 전체 카테고리 조회
  http.get('/api/categories', ({ request }) => {
    const url = new URL(request.url);
    const lang = url.searchParams.get('lang') || 'ko';

    const response: CategoriesResponse = {
      success: true,
      data: mockCategories,
    };

    return HttpResponse.json(response);
  }),

  // 특정 카테고리의 서브카테고리 조회
  http.get(
    '/api/categories/:categoryId/subcategories',
    ({ request, params }) => {
      const url = new URL(request.url);
      const lang = url.searchParams.get('lang') || 'ko';
      const { categoryId } = params;

      const category = mockCategories.find(
        (cat) => cat.id === parseInt(categoryId as string)
      );

      if (!category) {
        const errorResponse: SubcategoriesResponse = {
          success: false,
          data: [],
          message: 'Category not found',
        };

        return HttpResponse.json(errorResponse, { status: 404 });
      }

      const response: SubcategoriesResponse = {
        success: true,
        data: category.subcategories,
      };

      return HttpResponse.json(response);
    }
  ),
];
