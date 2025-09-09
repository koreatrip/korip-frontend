// plannerAPI.ts
import {
  type CreatePlanRequest,
  type CreatePlanResponse,
  type PlansResponse,
} from './plannerType';
import axiosInstance from '../axiosInstance';

export const plannerAPI = {
  // GET - 계획 목록 조회
  getAllPlans: async (): Promise<PlansResponse> => {
    const response = await axiosInstance.get('/api/plans/', {
      headers: { Accept: 'application/json' },
    });
    console.log(response.data);
    return response.data;
  },

  // POST - 계획 생성
  createPlan: async (
    planData: CreatePlanRequest
  ): Promise<CreatePlanResponse> => {
    const response = await axiosInstance.post('/api/plans/', planData, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    console.log('Plan created:', response.data);
    return response.data;
  },
};
