import { useQuery } from '@tanstack/react-query';
import { regionQueries } from './locationQueries';

/** 전체 지역 목록 조회 */
export const useGetRegionsQuery = (options?: any) => {
  return useQuery({
    ...regionQueries.regions.list(),
    ...options,
  });
};

/** 특정 지역 상세 정보 조회 */
export const useGetRegionDetailQuery = (regionId: number, options?: any) => {
  return useQuery({
    ...regionQueries.regions.detail(regionId),
    enabled: !!regionId, // regionId가 있을 때만 쿼리 실행
    ...options,
  });
};
