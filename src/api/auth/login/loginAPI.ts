import axios from 'axios';

import { type LoginRequest, type LoginResponse } from './loginType';

export const loginAPI = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>('api/users/login', data);
  return response.data;
};
