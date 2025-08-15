import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { type LoginRequest, type LoginResponse } from './loginType';
import { loginAPI } from './loginAPI';

/**
 * 일반 로그인을 위한 React Query Mutation 훅입니다.
 * @param options useMutation에 전달할 추가 옵션 (onSuccess, onError 등)
 */
export const useLoginMutation = (
  options?: UseMutationOptions<LoginResponse, Error, LoginRequest>
) => {
  return useMutation({
    // mutationFn은 실제 API 호출 함수여야 합니다.
    // 여기서 `loginAPI.postLogin` 함수 자체를 전달합니다.
    mutationFn: loginAPI,

    // onSuccess, onError 등의 추가 옵션을 병합합니다.
    ...options,
  });
};
