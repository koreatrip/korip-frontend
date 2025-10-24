import axiosInstance from '../axiosInstance';
import type { IdolRequestPayload, IdolRequestResponse } from './idolType';

export const idolAPI = {
  // 아이돌 신청 (POST)
  requestIdol: async (
    data: IdolRequestPayload
  ): Promise<IdolRequestResponse> => {
    const response = await axiosInstance.post('/api/idols/requests/', data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },
};
