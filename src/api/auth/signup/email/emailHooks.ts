import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { type emailCheckRequset, type emailSendRequest } from './emailType';
import { emailSendAPI, emailCheckAPI } from './emailAPI';

export const useEmailSendMutation = (
  options?: UseMutationOptions<void, Error, emailSendRequest>
) => {
  return useMutation({
    mutationFn: emailSendAPI,
    ...options,
  });
};

export const useEmailCheckMutation = (
  options?: UseMutationOptions<void, Error, emailCheckRequset>
) => {
  return useMutation({
    mutationFn: emailCheckAPI,
    ...options,
  });
};
