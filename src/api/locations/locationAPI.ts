import axios from 'axios';
import {
  type LocationSearchResponse,
  type LocationSuggestionsResponse,
  type LocationAllResponse,
} from './locationType';

export const locationAPI = {
  searchLocation: async (query: string): Promise<LocationSearchResponse> => {
    const response = await axios.get('/api/locations/search', {
      params: { query },
      headers: { Accept: 'application/json' },
    });
    return response.data;
  },

  getLocationSuggestions: async (
    query: string
  ): Promise<LocationSuggestionsResponse> => {
    const response = await axios.get('/api/locations/suggestions', {
      params: { query },
      headers: { Accept: 'application/json' },
    });
    return response.data;
  },

  getAllLocationNames: async (): Promise<LocationAllResponse> => {
    const response = await axios.get('/api/locations/all', {
      headers: { Accept: 'application/json' },
    });
    return response.data;
  },
};
