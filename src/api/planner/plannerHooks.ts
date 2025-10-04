import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { plannerQueries } from './plannerQueries';
import type {
  AddPlaceToPlanRequest,
  AddPlaceToPlanResponse,
  CreatePlanRequest,
  CreatePlanResponse,
  PlanDetail,
  PlansResponse,
  UpdatePlanRequest,
  UpdatePlanResponse,
} from './plannerType';
import { plannerAPI } from './plannerAPI';

export const usePlansQuery = (lang: string = 'ko', options?: any) => {
  return useQuery<PlansResponse>({
    ...plannerQueries.plans.all(lang),
    ...options,
  });
};

export const useCreatePlanMutation = (
  options?: UseMutationOptions<CreatePlanResponse, Error, CreatePlanRequest>
) => {
  const queryClient = useQueryClient();

  return useMutation<CreatePlanResponse, Error, CreatePlanRequest>({
    mutationFn: plannerAPI.createPlan,
    onSuccess: async (data, variables, context) => {
      // plans로 시작하는 모든 쿼리 무효화
      await queryClient.invalidateQueries({
        queryKey: ['plans'],
      });

      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
};

export const useAddPlaceToPlanMutation = (
  options?: UseMutationOptions<
    AddPlaceToPlanResponse,
    Error,
    { planId: string; placeData: AddPlaceToPlanRequest }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ planId, placeData }) =>
      plannerAPI.addPlaceToPlan(planId, placeData),
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: ['plans'],
      });

      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
};

export const usePlanDetailQuery = (
  planId: string,
  lang: string = 'ko',
  options?: any
) => {
  return useQuery<PlanDetail>({
    ...plannerQueries.plans.detail(planId, lang),
    ...options,
  });
};

export const useUpdatePlanMutation = (
  options?: UseMutationOptions<
    UpdatePlanResponse,
    Error,
    { planId: string; planData: UpdatePlanRequest }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ planId, planData }) =>
      plannerAPI.updatePlan(planId, planData),
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries({
        queryKey: ['plans'],
      });

      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
};

export const useDeletePlanMutation = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planId: string) => plannerAPI.deletePlan(planId),
    onSuccess: async (data, planId, context) => {
      await queryClient.invalidateQueries({
        queryKey: ['plans'],
      });

      options?.onSuccess?.(data, planId, context);
    },
    onError: (error, planId, context) => {
      options?.onError?.(error, planId, context);
    },
    ...options,
  });
};

export const useDeletePlaceFromPlanMutation = (
  options?: UseMutationOptions<void, Error, { planId: string; placeId: string }>
) => {
  return useMutation({
    mutationFn: ({ planId, placeId }) =>
      plannerAPI.deletePlaceFromPlan(planId, placeId),
    ...options,
  });
};
