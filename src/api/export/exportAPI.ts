// api/export/exportApi.ts
import axiosInstance from '../axiosInstance';
import type {
  ExportPlanPdfDataParams,
  ExportPlanPdfDataResponse,
} from './exportType';

export const exportAPI = {
  // 일정 PDF 데이터 내보내기 (GET)
  exportPlanPdfData: async (
    params: ExportPlanPdfDataParams
  ): Promise<ExportPlanPdfDataResponse> => {
    const { plan_id, lang = 'ko' } = params;

    const response = await axiosInstance.get(
      `/api/exports/plans/${plan_id}/pdf/data/`,
      {
        params: { lang },
        headers: {
          Accept: 'application/json',
        },
      }
    );
    return response.data;
  },
};
