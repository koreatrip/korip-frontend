import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { placesQueries } from './placeQueries';
import type {
  SubregionPlacesResponse,
  SubcategoryPlacesResponse,
} from './placeType';

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
    initialPageParam: 1,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options,
  });
};

// 서브카테고리별 명소 조회 훅 추가
export const useSubcategoryPlacesQuery = (
  params: {
    subcategory_id: number;
    lang?: string;
    page?: number;
    page_size?: number;
    region_id?: number;
    subregion_id?: number;
  },
  options = {}
) => {
  return useQuery({
    ...placesQueries.places.subcategory(params),
    enabled: !!params.subcategory_id, // subcategory_id가 있을 때만 실행
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options,
  });
};

// 서브카테고리별 무한 스크롤 훅 추가
export const useInfiniteSubcategoryPlacesQuery = (
  params: {
    subcategory_id: number | null;
    lang?: string;
    page_size?: number;
    region_id?: number;
    subregion_id?: number;
  },
  options = {}
) => {
  return useInfiniteQuery({
    ...placesQueries.places.infiniteSubcategory(params),
    enabled: !!params.subcategory_id,
    getNextPageParam: (
      lastPage: SubcategoryPlacesResponse
    ): number | undefined => {
      const currentPage = lastPage.page;
      const totalPages = lastPage.total_pages;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options,
  });
};

// 명소 상세 정보 훅
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
