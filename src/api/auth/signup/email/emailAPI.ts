import axios from 'axios';
import { type emailSendRequest, type emailCheckRequset } from './emailType';

export const emailSendAPI = async (data: emailSendRequest) => {
  const response = await axios.post('api/users/send-code', data);
  return response.data;
};

export const emailCheckAPI = async (data: emailCheckRequset) => {
  await axios.post('api/users/verify-code', data);
};
