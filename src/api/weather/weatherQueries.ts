import { createQueryKeyStore } from '@lukemorales/query-key-factory';
import { weatherAPI } from './weatherAPI';

export const weatherQueries = createQueryKeyStore({
  weather: {
    // 단일 API로 통합
    byLocation: (regionId: number, subregionId?: number) => ({
      queryKey: ['weather', regionId, subregionId],
      queryFn: () => weatherAPI.getWeather(regionId, subregionId),
    }),
  },
});
