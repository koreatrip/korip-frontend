import axios from 'axios';
import type { WeatherResponse } from './weatherType';

export const weatherAPI = {
  // 날씨 조회 (지역 또는 세부지역)
  getWeather: async (
    regionId: number,
    subregionId?: number
  ): Promise<WeatherResponse> => {
    try {
      const params = subregionId ? { subregion_id: subregionId } : {};

      console.log(`Calling API: /api/weather/region/${regionId}`, params);

      const response = await axios.get(`/api/weather/region/${regionId}`, {
        params,
        headers: { Accept: 'application/json' },
      });

      console.log(
        `Weather response for ${regionId}${subregionId ? `/${subregionId}` : ''}:`,
        response.data
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching weather for ${regionId}${subregionId ? `/${subregionId}` : ''}:`,
        error
      );
      throw error;
    }
  },
};
