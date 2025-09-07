import axios from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';

export const interestAPI = async (subSelected: number[]) => {
  try {
    const authState = useAuthStore.getState();
    const userId = authState.auth.user_id;
    if (!userId) {
      console.error('사용자 ID를 찾을 수 없습니다. API 요청을 중단합니다.');
      // 여기서 추가적인 에러 처리 (예: 로그인 페이지로 리디렉션) 가능
      return;
    }
    const response = await axios.post(`/api/users/${userId}/preferences`, {
      interests: { id: subSelected },
    });

    console.log('관심사 ID 목록 전송 완료:', response.data);
    return response.data;
  } catch (error) {
    console.error('관심사 ID 목록 전송 실패:', error);
    throw error;
  }
};
