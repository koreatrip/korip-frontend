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
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: plannerQueries.plans.all().queryKey,
      });

      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
};

// plannerHooks.ts에 추가
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
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: plannerQueries.plans.all().queryKey,
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
    onSuccess: (data, variables, context) => {
      // 전체 목록과 상세 정보 모두 무효화
      queryClient.invalidateQueries({
        queryKey: plannerQueries.plans.all().queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: plannerQueries.plans.detail(variables.planId).queryKey,
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
    onSuccess: (data, planId, context) => {
      // 전체 목록 무효화
      queryClient.invalidateQueries({
        queryKey: plannerQueries.plans.all().queryKey,
      });
      // 삭제된 plan의 상세 정보도 제거
      queryClient.removeQueries({
        queryKey: plannerQueries.plans.detail(planId).queryKey,
      });

      options?.onSuccess?.(data, planId, context);
    },
    onError: (error, planId, context) => {
      options?.onError?.(error, planId, context);
    },
    ...options,
  });
};
