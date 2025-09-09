import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { plannerQueries } from './plannerQueries';
import type {
  CreatePlanRequest,
  CreatePlanResponse,
  PlansResponse,
} from './plannerType';
import { plannerAPI } from './plannerAPI';

export const usePlansQuery = (options?: any) => {
  return useQuery<PlansResponse>({
    ...plannerQueries.plans.all(),
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
