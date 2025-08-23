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

    // 서브지역 명소 쿼리 추가
    subregion: (params: {
      subregion_id: number;
      lang?: string;
      page?: number;
      page_size?: number;
    }) => ({
      queryKey: ['places', 'subregion', params],
      queryFn: () => placesAPI.getSubregionPlaces(params),
    }),
    infiniteSubregion: (params: {
      subregion_id: number;
      lang?: string;
      page_size?: number;
    }) => ({
      queryKey: [
        'places',
        'infiniteSubregion',
        params.subregion_id.toString(),
        params.lang || 'ko',
        params.page_size?.toString() || '10',
      ],
      queryFn: ({ pageParam = 1 }: { pageParam?: number }) =>
        placesAPI.getSubregionPlaces({
          ...params,
          page: pageParam,
        }),
    }),
  },
});
