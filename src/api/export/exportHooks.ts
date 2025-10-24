// api/export/exportHooks.ts
import { useQuery } from '@tanstack/react-query';
import { exportQueries } from './exportQueries';

// 일정 PDF 데이터 조회 쿼리
export const useExportPlanPdfDataQuery = (
  planId: string,
  lang: string = 'ko',
  options?: any
) => {
  return useQuery({
    ...exportQueries.exports.planPdfData(planId, lang),
    enabled: false, // 수동으로만 호출하려면
    ...options,
  });
};
