import axios from 'axios';
import type {
  PlaceDetailResponse,
  PlacesResponse,
  SubregionPlacesResponse,
  SubcategoryPlacesResponse,
} from './placeType';

export const placesAPI = {
  getPlaces: async (params: {
    region_id: number;
    subregion_id?: number;
    lang?: string;
  }): Promise<PlacesResponse> => {
    try {
      console.log(`Calling API: /api/places/ with params:`, params);

      const response = await axios.get('/api/places/', {
        params: {
          region_id: params.region_id,
          ...(params.subregion_id && { subregion_id: params.subregion_id }),
          ...(params.lang && { lang: params.lang }),
        },
        headers: { Accept: 'application/json' },
      });

      console.log('실제 요청 URL:', response.config.url);
      console.log('실제 요청 params:', response.config.params);

      console.log(`Places response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching places:`, error);
      throw error;
    }
  },

  // 서브지역별 명소 조회 API
  getSubregionPlaces: async (params: {
    subregion_id: number;
    lang?: string;
    page?: number;
    page_size?: number;
    category_id?: number;
  }): Promise<SubregionPlacesResponse> => {
    try {
      console.log(
        `Calling API: /api/places/regions/${params.subregion_id}/ with params:`,
        params
      );

      const response = await axios.get(
        `/api/places/regions/${params.subregion_id}/`,
        {
          params: {
            ...(params.lang && { lang: params.lang }),
            ...(params.page && { page: params.page }),
            ...(params.page_size && { page_size: params.page_size }),
            ...(params.category_id && { category_id: params.category_id }),
          },
          headers: { Accept: 'application/json' },
        }
      );

      console.log(
        `Subregion places response for ${params.subregion_id}:`,
        response.data
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching subregion places for ID ${params.subregion_id}:`,
        error
      );
      throw error;
    }
  },

  // 서브카테고리별 명소 조회 API 추가
  getSubcategoryPlaces: async (params: {
    subcategory_id: number;
    lang?: string;
    page?: number;
    page_size?: number;
    region_id?: number;
    subregion_id?: number;
  }): Promise<SubcategoryPlacesResponse> => {
    try {
      console.log(
        `Calling API: /api/places/subcategories/${params.subcategory_id}/ with params:`,
        params
      );

      const response = await axios.get(
        `/api/places/subcategories/${params.subcategory_id}/`,
        {
          params: {
            ...(params.lang && { lang: params.lang }),
            ...(params.page && { page: params.page }),
            ...(params.page_size && { page_size: params.page_size }),
            ...(params.region_id && { region_id: params.region_id }),
            ...(params.subregion_id && { subregion_id: params.subregion_id }),
          },
          headers: { Accept: 'application/json' },
        }
      );

      console.log(
        `Subcategory places response for ${params.subcategory_id}:`,
        response.data
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching subcategory places for ID ${params.subcategory_id}:`,
        error
      );
      throw error;
    }
  },

  getPlaceDetail: async (params: {
    place_id: number;
    lang?: string;
  }): Promise<PlaceDetailResponse> => {
    try {
      console.log(
        `Calling API: /api/places/${params.place_id}/ with params:`,
        params
      );

      const response = await axios.get(`/api/places/${params.place_id}/`, {
        params: {
          ...(params.lang && { lang: params.lang }),
        },
        headers: { Accept: 'application/json' },
      });

      console.log(
        `Place detail response for ${params.place_id}:`,
        response.data
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching place detail for ID ${params.place_id}:`,
        error
      );
      throw error;
    }
  },
};
