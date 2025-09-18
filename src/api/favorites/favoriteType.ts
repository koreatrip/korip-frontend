// favoriteType.ts

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

export type FavoritePlacesResponse = {
  count: number;
  total_pages: number;
  page: number;
  page_size: number;
  next: string | null;
  previous: string | null;
  favorite_places: FavoritePlace[];
};

export type ToggleFavoritePlaceRequest = {
  place_id: number;
};

export type ToggleFavoritePlaceResponse = {
  is_favorite: boolean;
  message: string;
};

export type GetFavoritePlacesParams = {
  lang?: string;
  page?: number;
};
