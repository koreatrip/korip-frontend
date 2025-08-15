import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { type SignupRequest } from './signupType';
import { signupAPI } from './signupAPI';

export const useSignupMutation = (
  options?: UseMutationOptions<void, Error, SignupRequest>
) => {
  return useMutation({
    mutationFn: signupAPI,
    ...options,
  });
};
