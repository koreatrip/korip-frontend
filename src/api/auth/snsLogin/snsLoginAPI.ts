import axios, { AxiosError } from 'axios';
import {
  type SnsLoginSuccessResponse,
  type SnsLoginErrorResponse,
  type SnsLoginRequest,
} from './snsLoginType';

export const snsLoginAPI = async ({
  provider, // provider를 구조 분해 할당으로 분리
  ...data // 나머지 속성들은 data 객체로 묶음
}: SnsLoginRequest): Promise<SnsLoginSuccessResponse> => {
  try {
    const response = await axios.post<SnsLoginSuccessResponse>(
      'api/users/social-login',
      data, // body 데이터로 보냄
      {
        params: {
          provider, // query 데이터로 보냄
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<SnsLoginErrorResponse>;
      throw axiosError;
    }
    throw error;
  }
};
