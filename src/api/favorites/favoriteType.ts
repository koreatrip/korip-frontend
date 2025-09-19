export type FavoritePlace = {
  id: number;
  content_id: string;
  name: string;
  description: string;
  address: string;
  latitude: string;
  longitude: string;
  phone_number: string;
  use_time: string;
  link_url: string;
  image_url: string;
  is_favorite: boolean;
  category: {
    id: number;
    name: string;
  };
  sub_category: {
    id: number;
    name: string;
  };
  region: {
    id: number;
    name: string;
  };
  sub_region: {
    id: number;
    name: string;
  };
  favorite_count: number;
  created_at: string;
  updated_at: string;
  favorited_at: string;
};

// 지역 즐겨찾기 타입 추가
export type FavoriteRegion = {
  id: number;
  name: string;
  description: string;
  features: string;
  latitude: number;
  longitude: number;
  favorite_count: number;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
  favorited_at: string;
};

export type FavoritePlacesResponse = {
  count: number;
  total_pages: number;
  page: number;
  page_size: number;
  next: string | null;
  previous: string | null;
  favorite_places: FavoritePlace[];
};

// 지역 즐겨찾기 응답 타입 추가
export type FavoriteRegionsResponse = {
  count: number;
  total_pages: number;
  page: number;
  page_size: number;
  next: string | null;
  previous: string | null;
  favorite_subregions: FavoriteRegion[];
};

export type ToggleFavoritePlaceRequest = {
  place_id: number;
};

// 지역 즐겨찾기 토글 요청 타입 추가
export type ToggleFavoriteRegionRequest = {
  sub_region_id: number;
};

export type ToggleFavoritePlaceResponse = {
  is_favorite: boolean;
  message: string;
};

// 지역 즐겨찾기 토글 응답 타입 추가
export type ToggleFavoriteRegionResponse = {
  is_favorite: boolean;
  message: string;
};

export type GetFavoritePlacesParams = {
  lang?: string;
  page?: number;
};

// 지역 즐겨찾기 조회 파라미터 타입 추가
export type GetFavoriteRegionsParams = {
  lang?: string;
  page?: number;
};
