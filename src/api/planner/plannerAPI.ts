// plannerAPI.ts
import {
  type AddPlaceToPlanRequest,
  type AddPlaceToPlanResponse,
  type CreatePlanRequest,
  type CreatePlanResponse,
  type PlanDetail,
  type PlansResponse,
  type UpdatePlanRequest,
  type UpdatePlanResponse,
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

  // POST - 계획에 장소 추가
  addPlaceToPlan: async (
    planId: string,
    placeData: AddPlaceToPlanRequest
  ): Promise<AddPlaceToPlanResponse> => {
    const response = await axiosInstance.post(
      `/api/plans/${planId}/`,
      placeData,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );
    console.log('Place added to plan:', response.data);
    return response.data;
  },
  getPlanById: async (planId: string): Promise<PlanDetail> => {
    const response = await axiosInstance.get(`/api/plans/${planId}/`, {
      headers: { Accept: 'application/json' },
    });
    console.log('Plan detail:', response.data);
    return response.data;
  },

  updatePlan: async (
    planId: string,
    planData: UpdatePlanRequest
  ): Promise<UpdatePlanResponse> => {
    const response = await axiosInstance.patch(
      `/api/plans/${planId}/`,
      planData,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );
    console.log('Plan updated:', response.data);
    return response.data;
  },
  deletePlan: async (planId: string): Promise<void> => {
    await axiosInstance.delete(`/api/plans/${planId}/`, {
      headers: { Accept: 'application/json' },
    });
    console.log('Plan deleted:', planId);
  },
};
