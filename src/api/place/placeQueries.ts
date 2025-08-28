import { createQueryKeyStore } from '@lukemorales/query-key-factory';
import { placesAPI } from './placeAPI';

export const placesQueries = createQueryKeyStore({
  places: {
    list: (params: {
      region_id: number;
      subregion_id?: number;
      lang?: string;
    }) => ({
      queryKey: ['places', 'list', params],
      queryFn: () => placesAPI.getPlaces(params),
    }),

    // 서브지역 명소 쿼리
    subregion: (params: {
      subregion_id: number;
      lang?: string;
      page?: number;
      page_size?: number;
    }) => ({
      queryKey: ['places', 'subregion', params],
      queryFn: () => placesAPI.getSubregionPlaces(params),
    }),

    // 서브지역 무한 스크롤 쿼리
    infiniteSubregion: (params: {
      subregion_id: number;
      lang?: string;
      page_size?: number;
      category_id?: number;
    }) => ({
      queryKey: [
        'places',
        'infiniteSubregion',
        params.subregion_id.toString(),
        params.lang || 'ko',
        params.page_size?.toString() || '10',
        params.category_id?.toString() || 'all',
      ],
      queryFn: ({ pageParam = 1 }: { pageParam?: number }) =>
        placesAPI.getSubregionPlaces({
          ...params,
          page: pageParam,
        }),
    }),

    // 서브카테고리 명소 쿼리 추가
    subcategory: (params: {
      subcategory_id: number;
      lang?: string;
      page?: number;
      page_size?: number;
    }) => ({
      queryKey: ['places', 'subcategory', params],
      queryFn: () => placesAPI.getSubcategoryPlaces(params),
    }),

    // 서브카테고리 무한 스크롤 쿼리 추가
    infiniteSubcategory: (params: {
      subcategory_id: number | null;
      lang?: string;
      page_size?: number;
    }) => ({
      queryKey: [
        'places',
        'infiniteSubcategory',
        params.subcategory_id?.toString() || 'null',
        params.lang || 'ko',
        params.page_size?.toString() || '10',
      ],
      queryFn: ({ pageParam = 1 }: { pageParam?: number }) => {
        if (!params.subcategory_id) {
          return Promise.reject(new Error('subcategory_id is required'));
        }
        return placesAPI.getSubcategoryPlaces({
          subcategory_id: params.subcategory_id,
          lang: params.lang,
          page_size: params.page_size,
          page: pageParam,
        });
      },
    }),

    // 명소 상세 쿼리
    detail: (params: { place_id: number | null; lang?: string }) => ({
      queryKey: [
        'places',
        'detail',
        params.place_id?.toString() || '',
        params.lang || 'ko',
      ],
      queryFn: () => {
        if (!params.place_id) {
          throw new Error('place_id is required');
        }
        return placesAPI.getPlaceDetail({
          place_id: params.place_id,
          lang: params.lang,
        });
      },
    }),
  },
});
