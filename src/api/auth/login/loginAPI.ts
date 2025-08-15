import axiosInstance from '../../axiosInstance';

import { type LoginRequest, type LoginResponse } from './loginType';

export const loginAPI = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>(
    'api/users/login',
    data
  );
  return response.data;
};
