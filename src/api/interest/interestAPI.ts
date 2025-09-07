import axios from 'axios';

export const interestAPI = async (
  userId: number,
  payload: { preferences: number[] }
) => {
  try {
    const response = await axios.post(
      `/api/users/${userId}/preferences`,
      payload
    );
    console.log('관심사 데이터 전송 완료:', response.data);
    return response.data;
  } catch (error) {
    console.error('관심사 데이터 전송 실패:', error);
    throw error;
  }
};
