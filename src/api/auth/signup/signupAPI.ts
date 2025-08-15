import axios from 'axios';
import { type SignupRequest } from './signupType';

export const signupAPI = async (data: SignupRequest) => {
  const response = await axios.post('api/users/sign-up', data);
  return response.data;
};
