export type Place = {
  feature: string | null | undefined;
  id: number;
  content_id: string | null;
  name: string;
  description: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  phone_number: string;
  use_time: string;
  link_url: string;
  image_url: string | null;
  is_favorite: boolean;
  idol_names: string[] | null;
  idol_visits: IdolVisit[] | null;
  category: {
    id: number;
    name: string;
  };
  sub_category: {
    id: number;
    name: string;
  } | null;
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
};

export type Region = {
  id: number;
  name: string;
  description: string;
  feature: string;
};

export type SubRegion = {
  id: number;
  name: string;
  description: string | null;
  feature: string | null;
  region_id: number;
  latitude: number | null;
  longitude: number | null;
  is_favorite: boolean;
  favorite_count: number;
  created_at: string;
  updated_at: string;
};

// 기존 PlacesResponse
export type PlacesResponse = {
  popular_subregions: SubRegion[];
  major_places: Place[];
  region: Region;
  subregion?: SubRegion;
  user_recommended_places?: Place[];
  stay_places?: Place[];
};

// 서브지역별 명소 응답 타입
export type SubregionPlacesResponse = {
  count: number;
  total_pages: number;
  page: number;
  page_size: number;
  places: Place[];
};

// 서브카테고리별 명소 응답 타입 추가
export type SubcategoryPlacesResponse = {
  count: number;
  total_pages: number;
  page: number;
  page_size: number;
  places: Place[];
};

export type PlaceDetailResponse = {
  place: Place;
};

// placesType.ts

export type Category = {
  id: number;
  name: string;
};

export type SubCategory = {
  id: number;
  name: string;
} | null;

export type PlaceRegion = {
  id: number;
  name: string;
};

export type PlaceSubRegion = {
  id: number;
  name: string;
};

export type StayPlace = {
  id: number;
  content_id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  phone_number: string;
  use_time: string;
  link_url: string;
  image_url: string;
  category: Category;
  sub_category: SubCategory;
  region: PlaceRegion;
  sub_region: PlaceSubRegion;
  favorite_count: number;
  is_favorite: boolean;
  idol_names: string[] | null;
  idol_visits: any | null; // 실제 타입에 맞게 수정 필요
  created_at: string;
  updated_at: string;
};

export type StayPlacesResponse = {
  count: number;
  total_pages: number;
  page: number;
  page_size: number;
  next: string | null;
  previous: string | null;
  places: StayPlace[];
};

export type StayPlacesParams = {
  subregionId: number;
  lang?: string;
  page?: number;
  page_size?: number;
};

export type IdolVisit = {
  id: number;
  idol_name: string;
  idol_group: string;
  description: string;
  visit_date: string | null;
  source_url: string;
};
