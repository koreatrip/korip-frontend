import { useMutation } from '@tanstack/react-query';

import type { IdolRequestPayload } from './idolType';
import { idolAPI } from './idolAPI';

// 아이돌 신청 뮤테이션
export const useIdolRequestMutation = () => {
  return useMutation({
    mutationFn: (data: IdolRequestPayload) => idolAPI.requestIdol(data),
  });
};
