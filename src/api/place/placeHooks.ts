import { useQuery } from '@tanstack/react-query';
import { placesQueries } from './placeQueries';

export const usePlacesQuery = (
  params: {
    region_id: number;
    subregion_id?: number;
    lang?: string;
  },
  options = {}
) => {
  return useQuery({
    ...placesQueries.places.list(params),
    enabled: !!params.region_id, // region_id가 있을 때만 실행
    ...options,
  });
};
