import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { placesQueries } from './placeQueries';
import type { SubregionPlacesResponse } from './placeType';

export const usePlacesQuery = (
  params: {
    region_id: number;
    subregion_id?: number;
    lang?: string;
  },
  options = {}
) => {
  return useQuery({
    ...placesQueries.places.list(params),
    enabled: !!params.region_id, // region_id가 있을 때만 실행
    ...options,
  });
};

export const useSubregionPlacesQuery = (
  params: {
    subregion_id: number;
    lang?: string;
    page?: number;
    page_size?: number;
  },
  options = {}
) => {
  return useQuery({
    ...placesQueries.places.subregion(params),
    enabled: !!params.subregion_id, // subregion_id가 있을 때만 실행
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options,
  });
};

export const useInfiniteSubregionPlacesQuery = (
  params: {
    subregion_id: number;
    lang?: string;
    page_size?: number;
    category_id?: number;
  },
  options = {}
) => {
  return useInfiniteQuery({
    ...placesQueries.places.infiniteSubregion(params),
    enabled: !!params.subregion_id,
    getNextPageParam: (
      lastPage: SubregionPlacesResponse
    ): number | undefined => {
      const currentPage = lastPage.page;
      const totalPages = lastPage.total_pages;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1, // 이 부분 추가
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options,
  });
};

// 명소 상세 정보 훅 추가
export const usePlaceDetailQuery = (
  params: {
    place_id: number | null;
    lang?: string;
  },
  options = {}
) => {
  return useQuery({
    ...placesQueries.places.detail(params),
    enabled: !!params.place_id,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options,
  });
};
