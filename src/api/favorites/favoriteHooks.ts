// favoriteHooks.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { favoriteQueries } from './favoriteQueries';
import { favoriteAPI } from './favoriteAPI';
import type {
  FavoritePlacesResponse,
  ToggleFavoritePlaceRequest,
  GetFavoritePlacesParams,
} from './favoriteType';

// 즐겨찾기 장소 목록 조회 쿼리
export const useFavoritePlacesQuery = (
  params: GetFavoritePlacesParams = {},
  options?: any
) => {
  return useQuery<FavoritePlacesResponse>({
    ...favoriteQueries.favorites.places(params),
    ...options,
  });
};

// 즐겨찾기 장소 목록 조회 쿼리 (무한스크롤)
export const useFavoritePlacesInfiniteQuery = (
  params: Omit<GetFavoritePlacesParams, 'page'> = {}
) => {
  return useInfiniteQuery({
    queryKey: ['favorites', 'places', 'infinite', params],
    queryFn: ({ pageParam = 1 }) =>
      favoriteAPI.getFavoritePlaces({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      // next가 있으면 다음 페이지 번호 반환, 없으면 undefined
      return lastPage.next ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

// 즐겨찾기 토글 뮤테이션
export const useToggleFavoritePlaceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ToggleFavoritePlaceRequest) =>
      favoriteAPI.toggleFavoritePlace(data),
    onSuccess: () => {
      // 즐겨찾기 목록 쿼리들 무효화하여 재조회
      queryClient.invalidateQueries({
        queryKey: ['favorites', 'places'],
      });
    },
  });
};
