import axios from 'axios';
import type {
  FindAccountRequest,
  FindAccountResponse,
  FindPasswordRequest,
} from './accountType';

export const accountAPI = {
  // POST - 비밀번호 찾기
  findPassword: async (email: FindPasswordRequest): Promise<void> => {
    await axios.post('/api/users/find-pwd', email, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    console.log('Password reset email sent to:', email.email);
  },
  findAccount: async (
    data: FindAccountRequest
  ): Promise<FindAccountResponse> => {
    const response = await axios.post('/api/users/find-account', data, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    console.log('Accounts found:', response.data);
    return response.data;
  },
};
