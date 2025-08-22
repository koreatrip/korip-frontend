import axios from 'axios';
import type { PlacesResponse } from './placeType';

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
};
