import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { FindPasswordRequest } from './accountType';
import { accountAPI } from './accountAPI';

export const useFindPasswordMutation = (
  options?: UseMutationOptions<void, Error, FindPasswordRequest>
) => {
  return useMutation({
    mutationFn: (email: FindPasswordRequest) => accountAPI.findPassword(email),
    ...options,
  });
};
