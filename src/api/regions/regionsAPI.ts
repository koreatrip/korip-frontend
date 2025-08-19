import axios from 'axios';
import type { RegionDetailResponse, RegionsResponse } from './regionType';

export const regionsAPI = {
  // 새로 추가된 regions API들
  getRegions: async (): Promise<RegionsResponse> => {
    const response = await axios.get('/api/regions/', {
      headers: { Accept: 'application/json' },
    });
    return response.data;
  },

  getRegionDetail: async (regionId: number): Promise<RegionDetailResponse> => {
    try {
      console.log(`Calling API: /regions/${regionId}/`);
      const response = await axios.get(`/api/regions/${regionId}/`, {
        headers: { Accept: 'application/json' },
      });
      console.log(`Region detail response for ${regionId}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching region detail for ID ${regionId}:`, error);
      throw error;
    }
  },
};
