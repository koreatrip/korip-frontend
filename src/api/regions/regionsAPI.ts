import type {
  RegionDetailResponse,
  RegionsMajorResponse,
  RegionsResponse,
} from './regionType';
import axiosInstance from '../axiosInstance';
import axios from 'axios';

export const regionsAPI = {
  // 새로 추가된 regions API들
  getRegions: async (lang?: string): Promise<RegionsResponse> => {
    const params = lang ? { lang } : {};
    const response = await axiosInstance.get('/api/regions/', {
      params,
      headers: { Accept: 'application/json' },
    });
    return response.data;
  },

  getRegionsMajor: async (lang?: string): Promise<RegionsMajorResponse> => {
    try {
      const params = lang ? { lang } : {};
      const response = await axios.get('/api/regions/major', {
        params,
        headers: { Accept: 'application/json' },
      });
      console.log('Major regions response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching major regions:', error);
      throw error;
    }
  },

  getRegionDetail: async (
    regionId: number,
    lang?: string
  ): Promise<RegionDetailResponse> => {
    try {
      const params = lang ? { lang } : {};
      console.log(`Calling API: /regions/${regionId}/`, params);
      const response = await axiosInstance.get(`/api/regions/${regionId}/`, {
        params,
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
