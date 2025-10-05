import axios from 'axios';
import type { FindPasswordRequest } from './accountType';

export const accountAPI = {
  // 기존 코드...

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
};
