import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type {
  FindAccountRequest,
  FindAccountResponse,
  FindPasswordRequest,
} from './accountType';
import { accountAPI } from './accountAPI';

export const useFindPasswordMutation = (
  options?: UseMutationOptions<void, Error, FindPasswordRequest>
) => {
  return useMutation({
    mutationFn: (email: FindPasswordRequest) => accountAPI.findPassword(email),
    ...options,
  });
};

export const useFindAccountMutation = (
  options?: UseMutationOptions<FindAccountResponse, Error, FindAccountRequest>
) => {
  return useMutation({
    mutationFn: (data: FindAccountRequest) => accountAPI.findAccount(data),
    ...options,
  });
};
