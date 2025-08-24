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
    description: string;
    feature: string;
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
};

// 새로운 SubregionPlacesResponse 추가
export type SubregionPlacesResponse = {
  count: number;
  total_pages: number;
  page: number;
  page_size: number;
  places: Place[];
};

export type PlaceDetailResponse = {
  place: Place;
};
